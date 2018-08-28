"use strict";

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
  databaseURL: "https://tekdysten.firebaseio.com",
  projectId: "tekdysten",
  storageBucket: "tekdysten.appspot.com",
  databaseAuthVariableOverride: {uid:'server'},
});

exports.userCreated = require('./userCreated').default;

exports.partialTeamMatching = require('./partialTeamMatching').default;
exports.requestOpponentPool = require('./requestOpponentPool').default;
exports.opponentMatching = require('./opponentMatching').default;

const waitStations = require('./waitStations');
exports.addedWaitStationMember = waitStations.addedMember;
exports.removedWaitStationMember = waitStations.removedMember;

const activityPools = require('./activityPools');
exports.addedActivityPoolGame = activityPools.onCreate;
exports.removedActivityPoolGame = activityPools.onDelete;

exports.autoJudgeApproval = require('./autoJudgeApproval').default;
