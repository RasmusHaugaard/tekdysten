import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
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

class Root extends Component {
  constructor(props){
    super(props);
    this.state = {user: null};
  }
  componentDidMount(){
    const user = firebase.auth().currentUser;
    if (user) this.setState({user});
    firebase.auth().onAuthStateChanged(
      user => this.setState({user})
    );
  }
  render(){
    return <App user={this.state.user}/>;
  }
}

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Root/>
  </MuiThemeProvider>
,
  document.getElementById('root')
);

registerServiceWorker();
