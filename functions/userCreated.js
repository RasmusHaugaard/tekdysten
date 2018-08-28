"use strict";

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.database().ref();
const _ = require('lodash');

const alpha = 'abcdefghijklmnopqrstuvxyz0123456789';

// Create user on first facebook login
// Add auth -> user lookup
exports.default = functions.auth.user().onCreate(user => {
  const fbData = user.providerData.filter(data => data.providerId === 'facebook.com')[0];
  if (fbData){
    let names = fbData.displayName
      .split('/').join('')
      .split(' ');
    if (names.length > 2)
      names = [names[0], names[names.length-1]];
    const name = names.join('').toLowerCase() + '-' +
      Array(4).fill(null).map(() => _.sample(alpha)).join('');

    const updates = {};
    updates[`users/${name}`] = {
      displayName: fbData.displayName,
      photoURL: fbData.photoURL,
    };
    updates[`a2u/${user.uid}`] = name;
    return db.update(updates);
  }
  return true;
});
