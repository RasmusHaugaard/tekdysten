"use strict";

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.database().ref();

exports.default = functions.database
  .ref('judgerequests/{uid}')
  .onCreate((snap, context) => {
    const {uid} = context.params;
    return db.child('autojudgeapproval').once('value')
    .then(snap => snap.val())
    .then(autojudgeapproval => {
      if (autojudgeapproval){
        const updates = {};
        updates[`isjudge/${uid}`] = true;
        updates[`judgerequests/${uid}`] = null;
        return db.update(updates);
      }
      return true;
    });
  });
