import React, {PureComponent} from 'react';
import TeamList from './TeamList';
import ActivityHeader from './ActivityHeader';
import BackButton from './BackButton';
import firebase from 'firebase';
import CircularProgress from '@material-ui/core/CircularProgress';

const states = [
  {text: time => `Finding opponent.. ${time}`, time: 5},
  {text: time => `Opponent: someone who competes with or opposes another in a contest, game or argument. ${time}`, time: 15},
  {text: time => `I bet they're scared.. ${time}`, time: 10},
  {text: time => 'I am still trying to hook You guys up, but you\'d might wanna try another activity, try again later or ask someone nearby :)'},
];

class InOpponentPool extends PureComponent {
  state = {
    members: [],
    stateId: 0,
    time: states[0].time,
    userLeft: false,
  }

  componentDidMount(){
    const {team, activity} = this.props.userState;
    this.ref = firebase.database().ref(`opponentpools/${activity}/${team}`);
    this.ref.on('value', snap => {
      if (snap.val())
        this.setState(snap.val());
      else
        this.setState({userLeft: true});
    });
    this.startCountDown();
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

  componentWillUnmount(){
    this.ref.off();
    window.clearTimeout(this.countDownTimeout);
  }

  handleBackButton = () => {
    const {user} = this.props;
    const {team, activity} = this.props.userState;
    const {waitstation, userLeft} = this.state;
    // TODO: Add dialog here before action
    const updates = {};
    updates[`userState/${user.uid}`] = null;
    if(!userLeft){
      updates[`opponentpools/${activity}/${team}`] = null;
      if (waitstation)
        updates[`waitstations/${waitstation}/members/${team}`] = null;
    }
    firebase.database().ref().update(updates);
  }

  render(){
    const {activities, studies, userState} = this.props;
    const activityKey = userState.activity;
    const activity = activities[activityKey];
    if (!activity) return <div></div>;
    const {members, userLeft} = this.state;
    const players = Object.keys(members).map(memberKey => ({
      key: memberKey,
      study: members[memberKey].study,
      uid: members[memberKey].uid
    }));
    const stateId = this.state.stateId;
    const stateText = states[stateId].text(this.state.time);

    if (userLeft){
      return (
        <div>
          <ActivityHeader activity={activity} />
          <BackButton onClick={this.handleBackButton}/>
          <p>A user left the team. Sorry.</p>
          <TeamList {...{players, studies}} />
        </div>
      );
    }

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

export default InOpponentPool;
