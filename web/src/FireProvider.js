import React, { PureComponent } from 'react';
import firebase from 'firebase';

class FireProvider extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      val: props.alt || null,
    };
  }

  startRef(){
    if (this.props.pass) return;
    this.ref = firebase.database().ref(this.props.path);
    this.ref.on('value', snap => this.setState({val: snap.val()}));
  }

  stopRef(){
    if (this.ref) this.ref.off();
  }

  componentDidMount(){
    this.startRef();
  }

  componentWillUnmount(){
    this.stopRef();
  }

  componentDidUpdate(prevProps){
    if (
      prevProps.path === this.props.path &&
      prevProps.pass === this.props.pass
    ) return;
    this.stopRef();
    this.startRef();
  }

  render() {
    const {path, alt, propName, pass, children, ...childProps} = this.props;
    childProps[propName] = pass ? this.props.alt || null : this.state.val;
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, childProps)
    );
  }
}

export default FireProvider;
