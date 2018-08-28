import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import firebase from 'firebase';

class TDAvatar extends Component {
  constructor(props){
    super(props);
    this.state = {
      src: null,
    }
    if (props.useruid) this.updateSrc();
  }

  updateSrc(){
    this.srcPromise = firebase.database().ref('user').child(this.props.useruid)
    .child('photoURL').once('value').then(snap => {
      const src = snap.val();
      if (src){
        this.setState({src: src + '?width=' + (this.props.res || 100)});
      }
    });
  }

  componentDidUpdate(prevProps){
    if (prevProps.useruid !== this.props.useruid){
      this.updateSrc();
    }
  }

  render(){
    return (
      <Avatar
        src={this.state.src}
        {...(this.state.src ? {} : {children:"?"})}
      />
    );
  }
}

export default TDAvatar;
