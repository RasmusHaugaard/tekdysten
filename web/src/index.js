import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {unregister} from './registerServiceWorker';
import theme from './theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import firebase from 'firebase';

window.firebase = firebase;

firebase.initializeApp({
  apiKey: "AIzaSyCmEFGmOT-GczUngUGstEJb6E4SycL0N-4",
  authDomain: "tekdysten.dk",
  databaseURL: "https://tekdysten.firebaseio.com",
  projectId: "tekdysten",
  storageBucket: "tekdysten.appspot.com",
  messagingSenderId: "778641241079"
});

class Root extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      user: null,
      userState: null,
    };
  }

  componentDidMount(){
    const rootRef = firebase.database().ref();
    const user = firebase.auth().currentUser;
    if (user) this.setState({user});
    firebase.auth().onAuthStateChanged(user => {
      if (this.uidRef) this.uidRef.off();
      if (this.userRef) this.userRef.off();
      if (this.userStateRef) this.userStateRef.off();
      if (user){
        this.uidRef = rootRef.child('a2u').child(user.uid);
        this.uidRef.on('value', snap => {
          if (this.userRef) this.userRef.off();
          if (this.userStateRef) this.userStateRef.off();
          const uid = snap.val();
          this.userRef = rootRef.child('users/' + uid);
          this.userRef.on('value', snap => {
            this.setState({
              user: {
                uid,
                ...snap.val()
              }
            });
          });
          this.userStateRef = rootRef.child('userState/' + uid);
          this.userStateRef.on('value', snap => {
            this.setState({
              userState: snap.val(),
            });
          });
        });
      }else{
        this.setState({
          user: null,
          userState: null,
        });
      }
    });
  }
  render(){
    return <App {...this.state}/>;
  }
}

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Root/>
  </MuiThemeProvider>
,
  document.getElementById('root')
);

unregister();
