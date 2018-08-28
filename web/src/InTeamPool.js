import React, {PureComponent} from 'react';
import TeamList from './TeamList';
import ActivityHeader from './ActivityHeader';
import BackButton from './BackButton';
import firebase from 'firebase';
import CircularProgress from '@material-ui/core/CircularProgress';

const states = [
  {text: time => `Finding teammates.. ${time}`, time: 15},
  {text: time => `Looking harder.. ${time}`, time: 10},
  {text: time => `Looking really hard.. ${time}`, time: 10},
  {text: time => 'I am still trying to hook You up, but you\'d might wanna try another activity, try again later or ask someone nearby :)'},
];

class InTeamPool extends PureComponent {
  state = {
    members: [],
    stateId: 0,
    time: states[0].time
  }

  componentDidMount(){
    const {team, activity} = this.props.userState;
    this.ref = firebase.database().ref(`teampools/${activity}/pool/${team}`);
    this.ref.on('value', snap => this.setState(snap.val()));
    this.startCountDown();
    this.startServerPing();
  }

  startCountDown = () => {
    this.countDownTimeout = window.setTimeout(this.decrementTimer, 1000);
  }

  decrementTimer = () => {
    if (this.state.time <= 0){
      const newStateId = this.state.stateId + 1;
      const newState = states[newStateId];
      this.setState({
        stateId: newStateId,
        time: newState.time
      });
      if (newState.time)
        this.startCountDown();
    }else{
      this.setState({time: this.state.time - 1});
      this.startCountDown();
    }
  }

  startServerPing = () => {
    this.serverPingTimeout = window.setTimeout(this.onServerPingTimeout, 5000);
  }

  onServerPingTimeout = () => {
    const {activity} = this.props.userState;
    firebase.database().ref(`teampools/${activity}/ping`).set(
      firebase.database.ServerValue.TIMESTAMP
    ).catch(e => {});
    this.startServerPing();
  }

  componentWillUnmount(){
    this.ref.off();
    window.clearTimeout(this.countDownTimeout);
    window.clearTimeout(this.serverPingTimeout);
  }

  handleBackButton = () => {
    const {user} = this.props;
    const {team, activity} = this.props.userState;
    const updates = {};
    updates[`teampools/${activity}/pool/${team}`] = null;
    updates[`userState/${user.uid}`] = null;
    firebase.database().ref().update(updates);
  }

  render(){
    const {activities, studies, userState} = this.props;
    const activityKey = userState.activity;
    const activity = activities[activityKey];
    if (!activity) return <div></div>;
    const {members} = this.state;
    const players = Object.keys(members).map(memberKey => ({
      key: memberKey,
      study: members[memberKey].study,
      uid: members[memberKey].uid
    }));
    const stateId = this.state.stateId;
    const stateText = states[stateId].text(this.state.time);
    return (
      <div>
        <ActivityHeader activity={activity} />
        <BackButton onClick={this.handleBackButton}/>
        <p>{stateText}</p>
        <TeamList {...{players, studies}} />
        <p /><CircularProgress style={{color: 'white'}} /><p />
      </div>
    );
  }
}

export default InTeamPool;
