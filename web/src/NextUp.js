import React, {PureComponent} from 'react';
import Game from './Game';
import Button from './Button';
import firebase from 'firebase';

class NextUp extends PureComponent {

  moveGameToQueue = () => {
    const {station} = this.props;
    const updates = {};
    updates[`activitystations/${station.key}/next`] = null;
    updates[``]
    firebase.database().ref()
  }

  removeGame = () => {
    const {station} = this.props;
    // TODO: Add dialog here
    firebase.database().ref(`activitystations/${station.key}/next`).set(null);
  }

  render(){
    const {station} = this.props;
    const {game} = station.next;

    return (
      <div>
        <p/>
        Next up:
        <Game game={game}/>
        <Button onClick={this.moveGameToQueue}>Move back in queue</Button>
        Only remove the game, if they did not show up after a reasonable time.
        <Button onClick={this.removeGame}>Remove</Button>
      </div>
    );
  }
}

export default NextUp;
