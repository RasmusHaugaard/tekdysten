"use strict";

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.database().ref();

exports.addedMember = functions.database
  .ref('waitstations/{waitstation}/members/{member}')
  .onCreate((snap, context) => {
    const {waitstation} = context.params;
    const addedMemberCount = snap.val();
    return db.child(`waitstations/${waitstation}/membercount`)
      .transaction(count => count + addedMemberCount);
  });

exports.removedMember = functions.database
  .ref('waitstations/{waitstation}/members/{member}')
  .onDelete((snap, context) => {
    const {waitstation} = context.params;
    const addedMemberCount = snap.val();
    return db.child(`waitstations/${waitstation}/membercount`)
      .transaction(count => count - addedMemberCount);
  });
