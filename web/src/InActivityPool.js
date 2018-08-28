import React, {PureComponent} from 'react';
import TeamList from './TeamList';
import ActivityHeader from './ActivityHeader';
import BackButton from './BackButton';
import firebase from 'firebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import FireProvider from './FireProvider';

class InActivityPool extends PureComponent {
  state = {
    teams: {0:{},1:{}},
    waitstation: null,
    teamLeft: false,
    queuenumber: null,
  }

  componentDidMount(){
    const {game, activity} = this.props.userState;
    this.ref = firebase.database().ref(`activitypools/${activity}/${game}`);
    this.ref.on('value', snap => {
      if (snap.val()){
        const {teams, waitstation, queuenumber} = snap.val();
        this.setState({teams, waitstation, queuenumber});
      }else{
        this.setState({teamLeft: true});
      }
    });
  }

  componentWillUnmount(){
    this.ref.off();
  }

  handleBackButton = () => {
    const {user} = this.props;
    const {game, activity} = this.props.userState;
    const {waitstation, teamLeft} = this.state;
    // TODO: Add dialog here before action
    const updates = {};
    updates[`userState/${user.uid}`] = null;
    if(!teamLeft){
      updates[`activitypools/${activity}/${game}`] = null;
      if (waitstation)
        updates[`waitstations/${waitstation}/members/${game}`] = null;
    }
    firebase.database().ref().update(updates);
  }

  render(){
    const {activities, studies, userState} = this.props;
    const activityKey = userState.activity;
    const activity = activities[activityKey];
    if (!activity) return <div></div>;

    const {teams, teamLeft, queuenumber, waitstation} = this.state;

    const teamPlayers = Object.values(teams).map(team =>
      Object.keys(team).map(memberKey => ({
        key: memberKey,
        study: team[memberKey].study,
        uid: team[memberKey].uid,
      }))
    );

    if (teamLeft){
      return (
        <div>
          <ActivityHeader activity={activity} />
          <BackButton onClick={this.handleBackButton}/>
          <p>A team left the game. Sorry.</p>
          <TeamList {...{players: teamPlayers[0], studies}} />
          against
          <TeamList {...{players: teamPlayers[1], studies}} />
          <p/>
        </div>
      );
    }

    return (
      <div>
        <ActivityHeader activity={activity} />
        <BackButton onClick={this.handleBackButton}/>
        <p /><CircularProgress style={{color: 'white'}} /><p />
        <p>
        {waitstation ? [
          <span key="span">Meet at </span>,
          <FireProvider key="fp"
            propName='children'
            path={`waitstations/${waitstation}/name`}
          ><span/></FireProvider>,
          <br key="br"/>,
        ] : null}
        {queuenumber ? `Your game is number ${queuenumber+1} in queue.` : "Your game is in queue!"}
        </p>
        <TeamList {...{players: teamPlayers[0], studies}} />
        vs
        <TeamList {...{players: teamPlayers[1], studies}} />
      </div>
    );
  }
}

export default InActivityPool;
