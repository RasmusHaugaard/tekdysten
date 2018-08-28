import React, {PureComponent} from 'react';
import Avatar from '@material-ui/core/Avatar';
import AccountIcon from '@material-ui/icons/AccountCircle';
import FireProvider from './FireProvider';

const UrlProvider = props => (
  <FireProvider propName="src"
    alt={props.url || ''} pass={!!props.url || !props.uid}
    path={`users/${props.uid}/photoURL`}
    {...props}
  />
);

class UserAvatar extends PureComponent {
  render(){
    const {uid} = this.props;
    if (uid)
      return (
        <UrlProvider uid={uid}>
          <Avatar />
        </UrlProvider>
      );

    return (
      <Avatar style={{background: 'white'}}>
        <AccountIcon style={{fontSize: '2.2em'}}/>
      </Avatar>
    );
  }
}

export default UserAvatar;
