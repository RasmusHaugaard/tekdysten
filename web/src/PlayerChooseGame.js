import React, { Component } from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import './PlayerChooseGame.css';
import _ from 'lodash';

const remarks = [
  "Play or be played.",
  "Go go go!",
  "Let's kick ass!",
  "Uni is serious, now play!",
  "Remember to have fun!",
  "In the honor of your study..",
];

class PlayerChooseGame extends Component {
  constructor(props){
    super(props);
    this.state = {remark: ''};
  }

  componentDidMount(){
    this.setState({remark: _.sample(remarks)});
  }

  render(){
    const activities = this.props.activities;
    const activityElements = _.sortBy(Object.keys(activities), [
      a => !activities[a].isactive,
      a => activities[a].estWaitTime,
    ])
    .map(activityKey => {
      const activity = activities[activityKey];
      const subtitle = activity.isactive ?
        activity.estWaitTime + ' min wait' :
        'inactive';
      return (
        <GridListTile
          key={activityKey}
          onClick={() => activity.isactive ?
              this.props.onActivityChosen(activityKey) : ''
          }
        >
          <img src={activity.img} alt={activity.displayName}/>
          <GridListTileBar style={{height: activity.isactive ? 64 : 136}}
            title={activity.displayName}
            subtitle={subtitle}
          />
        </GridListTile>
      );
    });

    return (
      <div>
        <p>{"Click'n'play"}</p>
        <GridList
          cellHeight={136}
          spacing={10}
          className="Player-choose-game-grid"
        >
          {activityElements}
        </GridList>
      </div>
    );
  }
}

export default PlayerChooseGame;
