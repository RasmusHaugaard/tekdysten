import React, {PureComponent} from 'react';
import firebase from 'firebase';

class JudgeRequest extends PureComponent {

  componentDidMount(){
    this.request();
  }

  componentDidUpdate(oldProps){
    const {user} = this.props;
    if (oldProps !== this.props) this.request();
  }

  request = () => {
    const {user} = this.props;
    if (!user) return;
    firebase.database().ref(`judgerequests/${user.uid}`).set(true);
  }

  render = () => (
    <p>
      You have requested to become a judge. If you are not granted access shortly, please contact Rasmus Haugaard.
    </p>
  );
}

export default JudgeRequest;
