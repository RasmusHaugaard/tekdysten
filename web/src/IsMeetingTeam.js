import React, {PureComponent} from 'react';
import Button from './Button';
import TeamList from './TeamList';
import ActivityHeader from './ActivityHeader';
import BackButton from './BackButton';
import firebase from 'firebase';
import FireProvider from './FireProvider';

// TODO: maybe render a new component when the team has met,
// that allows to take a team photo, and write a team name?

class IsMeetingTeam extends PureComponent {
  state = {
    members: {},
    waitstation: null,
    userLeft: false,
    teammet: false,
    isRequestingOpponentPool: false,
  }

  componentDidMount(){
    const {team} = this.props.userState;
    this.ref = firebase.database().ref(`teammeetings/${team}`);
    this.ref.on('value', snap => {
      if (snap.val()){
        const {members, waitstation, teammet} = snap.val();
        this.setState({members, waitstation, teammet});
      }else{
        this.setState({userLeft: true});
      }
    });
  }

  componentWillUnmount(){
    this.ref.off();
  }

  handleBackButton = () => {
    const {user} = this.props;
    const {team} = this.props.userState;
    const {waitstation, userLeft} = this.state;
    if (userLeft){
      firebase.database().ref(`userState/${user.uid}`).set(null);
      return;
    }

    // TODO: open dialog to confirm this part
    const updates = {};
    updates[`teammeetings/${team}`] = null;
    updates[`userState/${user.uid}`] = null;
    if (waitstation)
      updates[`waitstations/${waitstation}/${team}`] = null;
    this.ref.off();
    firebase.database().ref().update(updates);
  }

  findOpponent = () => {
    const {team} = this.props.userState;
    this.setState({isRequestingOpponentPool: true});
    firebase.database().ref(`requestopponentpool/${team}`).set(true);
  }

  actionWeAreHere = () => {
    const {team} = this.props.userState;
    firebase.database().ref(`teammeetings/${team}/teammet`).set(true);
  }

  render(){
    const {activities, studies, userState} = this.props;
    const activityKey = userState.activity;
    const activity = activities[activityKey];
    if (!activity) return <div></div>;
    const {
      members,
      waitstation,
      userLeft,
      teammet,
      isRequestingOpponentPool,
    } = this.state;
    const players = Object.keys(members).map(memberKey => ({
      key: memberKey,
      study: members[memberKey].study,
      uid: members[memberKey].uid
    }));

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

    const weAreHere = <Button onClick={this.actionWeAreHere}>{"We're here"}</Button>;
    const findOpponent = <Button disabled={isRequestingOpponentPool} onClick={this.findOpponent}>Find oppponent</Button>

    return (
      <div>
        <ActivityHeader activity={activity} />
        <BackButton onClick={this.handleBackButton} />
        <p>
          You are a team!
          {waitstation ? [
            <br key="br"/>,
            <span key="span">Go meet at </span>,
            <FireProvider key="fp"
              path={`waitstations/${waitstation}/name`}
              propName='children'
              pass={!waitstation}
            >
              <span />
            </FireProvider>
          ] : ''}
        </p>
        <TeamList {...{players, studies}} />
        <p></p>
        {teammet ? findOpponent : weAreHere}
        <p></p>
      </div>
    );
  }
}

export default IsMeetingTeam;
