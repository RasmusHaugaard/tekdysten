import React, {PureComponent} from 'react';
import TeamList from './TeamList';


class Game extends PureComponent {
  render(){
    const {game} = this.props;
    const {teams} = game;

    const [teamA, teamB] = Object.values(teams)
      .map(team =>
        Object.keys(team.members || {})
        .map(key => ({...team.members[key], key}))
      );

    return (
      <div style={{textAlign: 'left'}}>
        <TeamList title='Team A' players={teamA} />
        <TeamList title='Team B' players={teamB} />
      </div>
    );
  }
}

export default Game;
