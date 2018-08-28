import React, { PureComponent } from 'react';
import List from '@material-ui/core/List';
import UserListItem from './UserListItem';
import ListSubheader from '@material-ui/core/ListSubheader';

class TeamList extends PureComponent {
  render(){
    const {players, onRemovePlayer, align, title} = this.props;
    const playerElements = players.map(player =>
      <UserListItem {...{key:player.key, player, onRemovePlayer}} align={align === 'right' ? 'right' : 'left'}/>
    );
    return (
      <List dense subheader={title ? <ListSubheader>{title}</ListSubheader> : null}>
        {playerElements}
      </List>
    );
  }
}

export default TeamList;
