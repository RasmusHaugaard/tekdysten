import React, { PureComponent } from 'react';
import FireProvider from './FireProvider';

class JudgeProvider extends PureComponent {
  render(){
    const {user} = this.props;
    return (
      <FireProvider
        propName='activitystations'
        path='activitystations'
      >
        <FireProvider
          propName='isjudge'
          pass={!user}
          path={`isjudge/${user && user.uid}`}
          {...this.props}
        />
      </FireProvider>
    );
  }
}

export default JudgeProvider;
