const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.database().ref();

exports.default = functions.database.ref('requestopponentpool/{teamKey}')
  .onCreate((dontcare, context) => {
    const {teamKey} = context.params;
    return db.child(`teammeetings/${teamKey}`).once('value')
    .then(snap => {
      const {activity, members, waitstation} = snap.val();
      const updates = {};
      updates[`requestopponentpool/${teamKey}`] = null;
      updates[`teammeetings/${teamKey}`] = null;
      updates[`opponentpools/${activity}/${teamKey}`] = {
        members,
        waitstation: waitstation||null,
        startedAt: admin.database.ServerValue.TIMESTAMP,
      };
      Object.keys(members).forEach(key => {
        const {uid} = members[key];
        if (uid) {
          updates[`userState/${uid}`] = {
            state: 'inopponentpool',
            activity,
            team: teamKey,
          };
        }
      });
      return db.update(updates);
    });
  });
