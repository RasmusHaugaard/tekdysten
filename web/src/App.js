import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import firebase from 'firebase';

const provider = new firebase.auth.FacebookAuthProvider();

class App extends Component {
  login() {
    firebase.auth().signInWithPopup(provider);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title"><span className="App-title-span">TEKDYSTEN</span></h1>
          <p className="App-place">
            at the slaughter house
          </p>
          <p className="App-time">
            31/8 - 2pm
          </p>
        </header>
        <section className="App-content">
          <p>
            Bring glory to your study and win a private party worth <span className="nowrap">10.000 DKK</span>.
          </p>
          <p>
            Login with facebook to get started. If you don't have facebook, go to the judge tent. They can help.
          </p>

          <Button onClick={this.login}>
            I'm ready
          </Button>
        </section>
        <footer>{this.props.user == undefined ? "ikke logget ind" : "logget ind"}</footer>
      </div>
    );
  }
}

export default App;
