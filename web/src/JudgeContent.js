import React, { Component } from 'react';
import JudgeLogin from './JudgeLogin';
import JudgeRequest from './JudgeRequest';
import JudgeChooseActivityStation from './JudgeChooseActivityStation';
import JudgeActivityStation from './JudgeActivityStation';

class JudgeContent extends Component {
  render(){
    const {user, userState, isjudge, activitystations} = this.props;
    if (!user) return <JudgeLogin/>;
    if (!isjudge) return <JudgeRequest user={user}/>;
    if (!activitystations) return <div>loading..</div>;
    if (userState && userState.state === 'judgeatactivitystation'){
      const activitystation = activitystations[userState.station];
      activitystation.key = userState.station;
      return <JudgeActivityStation user={user} station={activitystation}/>;
    }
    return <JudgeChooseActivityStation user={user} activitystations={activitystations}/>;
  }
}

export default JudgeContent;
