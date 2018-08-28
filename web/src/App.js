import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import AppRouter from './AppRouter';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header small={this.props.user ? true : false}/>
        <section className={"App-content" + (this.props.user ? " logged-in" : "")}>
          <div className="App-content-area">
            <AppRouter {...this.props} />
          </div>
        </section>
        <Footer {...this.props} />
      </div>
    );
  }
}

export default App;
