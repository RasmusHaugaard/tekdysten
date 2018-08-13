const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const db = admin.database().ref();

// Create user on first facebook login
// Add auth -> user lookup
exports.userCreated = functions.auth.user().onCreate(user => {
  fbData = user.providerData.filter(data => data.providerId === 'facebook.com')[0];
  if (fbData){
    let name = fbData.displayName.split(" ").join("").toLowerCase();

    return db.child('user').child(name).set({
      displayName: fbData.displayName,
      photoURL: fbData.photoURL,
      //more user data
    }).then(() => {
      return db.child('a2u').child(user.uid).set(name);
    });
  }
  return true;
});
