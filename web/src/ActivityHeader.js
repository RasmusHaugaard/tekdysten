import React, {PureComponent} from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

class ActivityHeader extends PureComponent {
  render(){
    const {activity, altTitle, altSubtitle} = this.props;

    const text = {title: altTitle || activity.displayName};
    if (altSubtitle === undefined){
      const {minPlayers:min, maxPlayers:max} = activity;
      text.subtitle = (max ? `${min} to ${max} players` : `minimum ${min} players`) + ' per team';
    }else if(altSubtitle){
      text.subtitle = altSubtitle;
    }

    return (
      <GridList
        style={{margin: '-1rem', marginBottom: 0}}
        cols={1} spacing={0}
      >
        <GridListTile style={{height: 68}}>
          <img src={activity.img} alt={activity.displayName} />
          <GridListTileBar {...text} style={{height: 68}}/>
        </GridListTile>
      </GridList>
    );
  }
}

export default ActivityHeader;
