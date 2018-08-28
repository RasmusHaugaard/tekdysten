import React, {PureComponent} from 'react';
import ActivityStationHeader from './ActivityStationHeader';
import BackButton from './BackButton';
import firebase from 'firebase';
import Button from './Button';
import JudgeMatch from './JudgeMatch';
import NextUp from './NextUp';

class JudgeActivityStation extends PureComponent {
  state = {
    busy: false,
  }

  handleBackButton = () => {
    const updates = {};
    const {user, station} = this.props;
    updates[`userState/${user.uid}`] = null;
    updates[`activitystations/${station.key}/judges/${user.uid}`] = null;
    firebase.database().ref().update(updates);
  }

  addNextUpFromQueue = () => {
    const {station} = this.props;
    const db = firebase.database().ref();
    this.setState({busy: true});
    db.child(`activitypools/${station.activity}`)
    .orderByChild('queuenumber')
    .limitToFirst(1) // only one, indexed by queuenumber
    .once('value')
    .then(snap => {
      if (!snap.val()) return;
      if (this.props.station.next) return;
      const updates = {};
      const [gameKey, game] = Object.entries(snap.val())[0];
      updates[`activitypools/${station.activity}/${gameKey}`] = null;
      updates[`activitystations/${station.key}/next`] = game;
      return db.update(updates);
    })
    .then(() => this.setState({busy: false}))
    .catch(() => this.setState({busy: false}));
  }

  addNextUpManually = () => {
    const {station} = this.props;
    const db = firebase.database().ref();
    const teams = {};
    teams[db.push().key] = {startedAt: firebase.database.ServerValue.TIMESTAMP};
    teams[db.push().key] = {startedAt: firebase.database.ServerValue.TIMESTAMP};
    db.child(`activitystations/${station.key}/next`).set({
      teams,
    }).then(e => console.log(e));
  }

  startNextUp = () => {
    const {station} = this.props;
    const updates = {};
    const current = {...station.next, startedAt: firebase.database.ServerValue.TIMESTAMP};
    updates[`activitystations/${station.key}/current`] = current;
    updates[`activitystations/${station.key}/next`] = null;
    firebase.database().ref().update(updates);
  }

  render(){
    const {station} = this.props;
    const {busy} = this.state;

    const noNextUp = (
      <div style={{marginBottom: '2rem'}}>
        <p/>
        <p>Next up:</p>
        <Button onClick={this.addNextUpFromQueue}>Add from queue</Button>
        <p/>
        <Button onClick={this.addNextUpManually}>Add manually</Button>
      </div>
    );

    return (
      <div>
        <ActivityStationHeader
          activity={station.activity}
          title={station.displayName}
          subtitle={null}
        />
        <BackButton onClick={this.handleBackButton}/>
        {station.next ? null : noNextUp}
        {station.current ? <JudgeMatch game={station.current} station={station}/> : null}
        {station.next && !station.current ? <Button disabled={busy} onClick={this.startNextUp}>Start Game</Button> : null}
        {station.next ? <NextUp station={station}/> : null}
      </div>
    );
  }
}

export default JudgeActivityStation;
