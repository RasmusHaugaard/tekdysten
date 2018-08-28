"use strict";

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const utils = require('./utils');

const db = admin.database().ref();

Object.values = obj => Object.keys(obj).map(key => obj[key]);

exports.default = functions.database.ref('opponentpools/{activity}')
  .onUpdate((snap, context) => {
    const poolObj = snap.after.val();
    const activity = context.params.activity;

    const promise = Promise.all([
      db.child('waitstations').once('value'),
    ]).then(arr => {
      const waitStations = utils.objToList(arr[0].val());

      // From object to list sorted by entry point
      let pool = utils.objToList(poolObj)
        .sort((a, b) => a.startedAt < b.startedAt ? -1 : 1);

      // Look for matches
      const promises = [];
      for (let a = 0; a < pool.length; a++){
        const A = pool[a];
        const team = [A];
        const studies = {};
        Object.values(A.members).forEach(member => studies[member.study] = true);
        for (let b = a + 1; b < pool.length; b++){
          const B = pool[b];
          const studyMatch = Object.values(B.members).reduce(
            (match, member) => match || studies[member.study], false
          );
          if (!studyMatch){
            // no study match means they can battle!!!
            const updates = {};

            const gameKey = db.push().key;

            let waitstation = A.waitstation||B.waitstation;
            if (!waitstation){
              waitStations.sort((a, b) => a.membercount < b.membercount ? -1 : 1);
              waitstation = waitStations[0].key;
            }
            const teams = {};
            teams[A.key] = A.members;
            teams[B.key] = B.members;
            updates[`waitstations/${waitstation}/${gameKey}`] = true;
            updates[`activitypools/${activity}/${gameKey}`] = {
              teams: teams,
              waitstation: waitstation,
              startedAt: admin.database.ServerValue.TIMESTAMP,
            };
            let gameSize = 0;
            [A, B].forEach(team => {
              updates[`opponentpools/${activity}/${team.key}`] = null;
              const teamSize = Object.keys(team.members).length;
              gameSize += teamSize;
              if (team.waitstation){
                updates[`waitstations/${team.waitstation}/${team.key}`] = null;
                waitStations.find(ws => ws.key === team.waitstation).membercount -= teamSize;
              }
              Object.values(team.members).forEach(member => {
                if (member.uid){
                  updates[`userState/${member.uid}`] = {
                    state: 'inactivitypool',
                    activity: activity,
                    game: gameKey,
                  };
                }
              });
            });
            waitStations.find(ws => ws.key === waitstation).membercount += gameSize;
            pool = [].concat.apply([], [
              pool.splice(a + 1, b),
              pool.splice(b + 1),
            ]);
            a = -1;
            promises.push(db.update(updates));
            break;
          }
        }
      }
      console.log('promiseCount:', promises.length);
      return Promise.all(promises);
    });
    return promise;
  });
