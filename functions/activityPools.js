"use strict";

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.database().ref();

const utils = require('./utils');

const updateIndices = activity => db.child(`activitypools/${activity}`)
  .once('value')
  .then(snap => snap.val()||{})
  .then(pool => utils.objToList(pool))
  .then(pool => {
    pool.sort((a, b) => a.startedAt < b.startedAt ? -1 : 1);
    const promises = pool.map(
      (game, i) => db.child(`activitypools/${activity}/${game.key}/queuenumber`).set(i)
    );
    promises.push(db.child(`activitypoolsizes/${activity}`).set(pool.length));
    return Promise.all(promises);
  });

exports.onCreate = functions.database
  .ref('activitypools/{activity}/{game}')
  .onCreate((snap, context) => updateIndices(context.params.activity));

exports.onDelete = functions.database
  .ref('activitypools/{activity}/{game}')
  .onDelete((snap, context) => updateIndices(context.params.activity));
