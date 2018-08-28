import React, { PureComponent } from 'react';
import ActivityHeader from './ActivityHeader';
import Button from './Button';
import BackButton from './BackButton';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TeamList from './TeamList';
import firebase from 'firebase';

class PlayerChooseTeam extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      team: [],
      selStudy: this.props.user.study,
    };
    this.ref = firebase.database().ref();
    this.userKey = this.ref.push().key;
  }

  addPlayer = () => {
    this.setState({
      team: [
        ...this.state.team,
        {
          key: this.ref.push().key,
          study: this.state.selStudy,
        },
      ],
    });
  }

  removePlayer = player => {
    const i = this.state.team.indexOf(player);
    this.setState({
      team: [
        ...this.state.team.slice(0, i),
        ...this.state.team.slice(i + 1),
      ],
    });
  }

  action = () => {
    const {activity} = this.props;
    const {uid, study} = this.props.user;
    const min = activity.minPlayers;
    const playerCount = this.state.team.length + 1;

    const members = {};
    for (let player of this.state.team)
      members[player.key] = {study: player.study};
    members[this.userKey] = {study, uid};
    const teamKey = this.ref.push().key;
    const updates = {};
    if (playerCount >= min){
      // Already a valid team
      updates[`teammeetings/${teamKey}`] = {
        activity: activity.key,
        members,
        teammet: true,
      };
      updates[`userState/${uid}`] = {
        state: 'ismeetingteam',
        activity: activity.key,
        team: teamKey,
      };
    }else{
      // Find team - Add person(s) to pool
      updates[`teampools/${activity.key}/pool/${teamKey}`] = {
        startedAt: firebase.database.ServerValue.TIMESTAMP,
        members,
      };
      updates[`userState/${uid}`] = {
        state: 'inteampool',
        activity: activity.key,
        team: teamKey,
      };
    }
    this.ref.update(updates);
  }

  render(){
    const {user, activity, studies} = this.props;
    const [min, max] = [activity.minPlayers, activity.maxPlayers];
    const players = [{key: this.userKey, ...user}, ...this.state.team];
    const fullTeam = max ? players.length >= max : false;
    return <div>
      <ActivityHeader activity={activity} />
      <BackButton onClick={this.props.onClickBack}/>
      <Button style={{width: '100%', marginTop: '1rem'}}
        onClick={this.action}
      >
        {players.length >= min ? 'We are a team' : 'Find teammates'}
      </Button>
      <p>If you are already with teammates, add them below.</p>
      <TeamList {...{players, studies}}
        onRemovePlayer={this.removePlayer}
      />
      <div style={{
        display: fullTeam ? 'none' : 'flex', justifyContent: 'center',
        paddingTop: 7, alignItems: 'center'
      }}>
        <Avatar onClick={this.addPlayer}
          style={{background: 'white', marginLeft: 5, marginRight: 21, width: 30, height: 30}}
        >
          <AddIcon style={{fontSize: '1.6em'}}/>
        </Avatar>
        <Select
          value={this.state.selStudy}
          onChange={e => this.setState({selStudy: e.target.value})}
          style={{fontSize: 13, height: 30}}
        >
          {Object.keys(studies).map(studyKey =>
            <MenuItem key={studyKey} value={studyKey}>
              {studies[studyKey].displayName}
            </MenuItem>
          )}
        </Select>
        <p></p>
      </div>
    </div>;
  }
}

export default PlayerChooseTeam;
