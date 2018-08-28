import React, { PureComponent } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom';
import Button from './Button';
import PlayerContent from './PlayerContent';
import JudgeContent from './JudgeContent';
import JudgeProvider from './JudgeProvider';
import Privacy from './Privacy';

class AppRouter extends PureComponent {
  render(){
    const Player = props => <PlayerContent {...this.props} />;
    const Judge = props => (
      <JudgeProvider {...this.props}>
        <JudgeContent/>
      </JudgeProvider>
    );
    const noMatch = props => (
      <div>
        <p>No such page</p>
        <Link to="/" style={{textDecoration: 'none'}}><Button>Home</Button></Link>
      </div>
    );

    return (
      <Router>
        <Switch>
          <Route exact path="/privacy" component={Privacy} />
          <Route exact path="/" component={Player} />
          <Route path="/judge" component={Judge} />
          <Route component={noMatch} />
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
