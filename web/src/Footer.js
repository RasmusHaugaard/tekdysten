import React, { Component } from 'react';
import './Footer.css';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import firebase from 'firebase';
import FireProvider from './FireProvider';

class Footer extends Component {
  render() {
    const user = this.props.user;
    const primary = user ? user.displayName : "Loading..";
    const secondary = user && user.study ? user.study : "";
    const src = user && user.photoURL ? user.photoURL + "?width=100" : null;
    const avatarProps = src ? {src} : {children:"?"};
    const studyNamePath = 'studies/' + secondary + '/displayName';

    return (
      <footer className={"Footer" + (this.props.user ? "" : " hide")}>
        <ListItem className="Footer-list-item" dense={true}>
          <Avatar {...avatarProps} />
          <FireProvider pass={!secondary} propName="secondary" path={studyNamePath} alt={secondary}>
            <ListItemText primary={primary} secondary={secondary} />
          </FireProvider>
        </ListItem>
        <Button className="Logout" size="small" onClick={() => firebase.auth().signOut()}>Logout</Button>
      </footer>
    );
  }
}

export default Footer;
