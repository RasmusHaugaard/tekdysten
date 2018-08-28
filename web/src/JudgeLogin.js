import React, { Component } from 'react';
import Button from './Button';
import firebase from 'firebase';

const provider = new firebase.auth.FacebookAuthProvider();

class JudgeLogin extends Component {
  constructor(props){
    super(props);
    this.state = {busy: false};
  }

  login() {
    this.setState({busy: true});
    firebase.auth().signInWithPopup(provider).then(e => {
      this.setState({busy: false});
    }).catch(e => {
      this.setState({busy: false});
    });
  }

  render(){
    return (
      <div>
        <p>
          Let us make the new students have a hell of a day!
        </p>
        <p>
          Login with facebook to get started.
        </p>

        <Button disabled={this.state.busy} onClick={() => this.login()}>
          I'm ready
        </Button>
      </div>
    );
  }
}

export default JudgeLogin;
