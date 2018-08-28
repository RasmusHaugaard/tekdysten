import React, {PureComponent} from 'react';
import Game from './Game';

class JudgeMatch extends PureComponent {


  render(){
    return(
      <div>
        <p/>
        Current game:
        <Game game={this.props.game}/>
      </div>
    );
  }
}

export default JudgeMatch;
