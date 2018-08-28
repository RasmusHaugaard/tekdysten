import React, {PureComponent} from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';

import _ from 'lodash';

import firebase from 'firebase';

class JudgeChooseActivityStation extends PureComponent {

  select = station => {
    const {user} = this.props;
    const updates = {};
    updates[`activitystations/${station}/judges/${user.uid}`] = true;
    updates[`userState/${user.uid}`] = {
      state: 'judgeatactivitystation',
      station,
    };
    firebase.database().ref().update(updates);
  }

  render(){
    const {activitystations} = this.props;
    const listItems = _.sortBy(
      Object.entries(activitystations).filter(([key, station]) => station.isactive),
      [
        ([key, station]) => station.judges ? true : false,
        ([key, station]) => station.displayName,
      ]
    ).map(([key, station]) => {
      const text = {primary: station.displayName};
      if (station.judges) text.secondary = Object.keys(station.judges)[0];
      return <ListItem key={key} button onClick={() => this.select(key)}>
        <ListItemText {...text}/>
      </ListItem>;
    });

    return (
      <div>
        <p>Choose an empty activitystation:</p>
        <List>{listItems}</List>
      </div>
    );
  }
}

export default JudgeChooseActivityStation;
