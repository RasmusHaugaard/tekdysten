import React, { PureComponent } from 'react';
import PlayerLogin from './PlayerLogin';
import PlayerChooseStudy from './PlayerChooseStudy';
import PlayerChooseGame from './PlayerChooseGame';
import PlayerChooseTeam from './PlayerChooseTeam';
import InTeamPool from './InTeamPool';
import IsMeetingTeam from './IsMeetingTeam';
import InOpponentPool from './InOpponentPool';
import InActivityPool from './InActivityPool';

import firebase from 'firebase';

class PlayerContent extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      studies: {},
      activity: null,
      activities: {},
    };
    this.activitiesRef = firebase.database().ref('activities');
    this.studiesRef = firebase.database().ref('studies');
  }

  componentDidMount(){
    this.startRef();
  }

  componentWillUnmount(){
    this.stopRef();
  }

  startRef(){
    this.activitiesRef.on('child_added', snap => {
      const activities = {...this.state.activities};
      activities[snap.key] = snap.val();
      this.setState({activities});
    });
    this.activitiesRef.on('child_changed', snap => {
      const activities = {...this.state.activities};
      activities[snap.key] = snap.val();
      this.setState({activities});
    });
    this.activitiesRef.on('child_removed', snap => {
      const activities = {...this.state.activities};
      console.log('before', activities);
      delete activities[snap.key];
      this.setState({activities});
    });
    this.studiesRef.on('value', snap => {
      this.setState({studies: snap.val()});
    })
  }

  stopRef(){
    this.activitiesRef.off();
    this.studiesRef.off();
    this.setState({activities: {}});
  }

  render(){
    const {user, userState} = this.props;
    const {activities} = this.state;
    const activityKey = this.state.activity;
    const props = {...this.props, ...this.state};

    if (!user) return <PlayerLogin />;
    if (!user.study) return <PlayerChooseStudy {...props} />;
    if (userState && userState.state === 'inteampool')
      return <InTeamPool {...props} />;
    if (userState && userState.state === 'ismeetingteam')
      return <IsMeetingTeam {...props} />;
    if (userState && userState.state === 'inopponentpool')
      return <InOpponentPool {...props} />;
    if (userState && userState.state === 'inactivitypool')
      return <InActivityPool {...props} />;

    if (!activityKey)
      return <PlayerChooseGame {...props}
        onActivityChosen={activity => this.setState({activity})}
      />;
    const activity = {...activities[activityKey], key: activityKey};
    return <PlayerChooseTeam
      {...props}
      activity={activity}
      onClickBack={() => this.setState({activity: null})}
    />;
  }
}

export default PlayerContent;
