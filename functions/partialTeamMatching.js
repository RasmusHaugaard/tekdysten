"use strict";

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const utils = require('./utils');

const db = admin.database().ref();

Object.values = obj => Object.keys(obj).map(key => obj[key]);

// Match partial teams to let them meet up with new people
exports.default = functions.database.ref('teampools/{activity}/ping')
  .onUpdate((snap, context) => {
    console.log('update enter:', 1);
    const activity = context.params.activity;
    const promise = Promise.all([
      db.child(`teampools/${activity}/pool`).once('value'),
      db.child('waitstations').once('value'),
      db.child(`activities/${activity}`).once('value'),
    ]).then(arr => {
      const poolObj = arr[0].val();
      if (!poolObj) return 0;
      const waitStations = utils.objToList(arr[1].val());
      const {minPlayers, desPlayers, maxPlayers} = arr[2].val();

      // From object to list sorted by entry point
      let pool = utils.objToList(poolObj)
        .sort((a, b) => a.startedAt < b.startedAt ? -1 : 1);

      // Look for potential matches based on the partial team state
      const promises = [];
      for (let a = 0; a < pool.length; a++){
        const A = pool[a];
        const team = [A];
        let teamSize = Object.keys(A.members).length;

        const timeWaited = (Date.now() - A.startedAt) / 1000;
        console.log('timewaited', timeWaited);
        const ignoreDesPlayers = timeWaited > 15; // sec
        const ignoreStudy = timeWaited > 20; // sec

        const studies = {};
        Object.values(A.members).forEach(member => studies[member.study] = true);
        for (let b = a + 1; b < pool.length; b++){
          const B = pool[b];
          const bSize = Object.keys(B.members).length;
          if (maxPlayers && (teamSize + bSize > maxPlayers)) continue;
          const studyMatch = Object.values(B.members).reduce(
            (match, member) => studies[member.study] || match, false
          );
          if (studyMatch || ignoreStudy){
            team.push(B);
            teamSize += bSize;
            if (teamSize >= desPlayers) break;
          }
        }

        if (teamSize >= (ignoreDesPlayers ? minPlayers : desPlayers)){
          // Build an update object containing
          // all necesarry updates to update atomically
          const teamKey = db.push().key;
          const updates = {};

          // remove partial teams from the teampool
          team.forEach(partialTeam => {
            updates[`teampools/${activity}/pool/${partialTeam.key}`] = null;
          });

          // add team to teammeetings
          const teamMembers = {};
          team.forEach(partialTeam => {
            Object.keys(partialTeam.members).forEach(memberKey => {
              teamMembers[memberKey] = partialTeam.members[memberKey];
            });
          });
          waitStations.sort((a, b) => a.membercount < b.membercount ? -1 : 1);
          const waitStation = waitStations[0];
          waitStation.membercount += teamSize;
          updates[`teammeetings/${teamKey}`] = {
            members: teamMembers,
            activity: activity,
            waitstation: waitStation.key,
          };

          // add team to waitstation
          updates[`waitstations/${waitStation.key}/members/${teamKey}`] = teamSize;

          // update userStates for each uid member
          Object.values(teamMembers).forEach(member => {
            if (!member.uid) return;
            updates[`userState/${member.uid}`] = {
              state: 'ismeetingteam',
              activity: activity,
              team: teamKey,
            };
          });

          // remove partial teams from pool to not
          // match same partial team in multiple teams
          const poolParts = [];
          const teamIndices = team.map(pTeam => pool.indexOf(pTeam));
          let lastIndex = -1;
          for (let teamIndex of teamIndices){
            poolParts.push(pool.splice(lastIndex + 1, teamIndex));
            lastIndex = teamIndex;
          }
          poolParts.push(pool.splice(lastIndex + 1));
          pool = [].concat.apply([], poolParts);
          // since we removed a, a will already be pointing at the next before inc
          a--;

          // push the update promise to promises array
          promises.push(db.update(updates));
        }
      }
      console.log('promises:', promises.length);
      return Promise.all(promises);
    });
    return promise;
  });
