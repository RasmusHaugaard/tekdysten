import React, { Component } from 'react';
import Button from './Button';
import firebase from 'firebase';

const provider = new firebase.auth.FacebookAuthProvider();

class PlayerLogin extends Component {
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
          Bring glory to your study and win a private party worth <span className="nowrap">10.000 DKK</span>.
        </p>
        <p>
          Login with facebook to get started. If you don't have facebook, go to the judge tent. They can help.
        </p>

        <Button disabled={this.state.busy} onClick={() => this.login()}>
          I'm ready
        </Button>
      </div>
    );
  }
}

export default PlayerLogin;
