import React, {PureComponent} from 'react';
import FireProvider from './FireProvider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import UserAvatar from './UserAvatar';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

const DisplayNameProvider = props => (
  <FireProvider propName="displayName"
    alt={props.displayName || ''} pass={!!props.displayName || !props.uid}
    path={`users/${props.uid}/displayName`}
    {...props}
  />
);

const StudyProvider = props => (
  <FireProvider propName="study"
    alt={props.study || ''} pass={!!props.study || !props.uid}
    path={`users/${props.uid}/study`}
    children={props.children}
    {...props}
  />
);

const StudyNameProvider = props => (
  <FireProvider propName="studyName"
    alt={props.studyName || ''} pass={!!props.studyName || !props.study}
    path={`studies/${props.study}/displayName`}
    children={props.children}
    {...props}
  />
);

// TODO: have a prop change direction from right->left to left->right

const PureUserListItem = props => {
  const {onRemovePlayer} = props;
  const {uid, displayName, studyName} = props;
  const action = !uid && onRemovePlayer ?
    <ListItemSecondaryAction>
      <IconButton onClick={() => onRemovePlayer(props.player)} style={{color:'white'}}>
        <AddIcon style={{transform:'rotate(45deg)'}}/>
      </IconButton>
    </ListItemSecondaryAction>
     :
    null;

  const listItemText = !displayName ?
    <ListItemText primary={studyName} /> :
    <ListItemText primary={displayName} secondary={studyName} />;

  return (
    <ListItem style={{flexDirection: props.align === 'right' ? 'row-reverse' : 'row'}}>
      <UserAvatar uid={uid}/>
      {listItemText}
      {action}
    </ListItem>
  );
}

class UserListItem extends PureComponent {
  render(){
    return (
      <DisplayNameProvider {...this.props.player}>
        <StudyProvider>
          <StudyNameProvider>
            <PureUserListItem
              align={this.props.align}
              player={this.props.player} onRemovePlayer={this.props.onRemovePlayer}
            />
          </StudyNameProvider>
        </StudyProvider>
      </DisplayNameProvider>
    );
  }
}

export default UserListItem;
