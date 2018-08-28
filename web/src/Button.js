import React, { Component } from 'react';
import MuiButton from '@material-ui/core/Button';
import './Button.css';

class Button extends Component {
  render(){
    return (
      <MuiButton className="TDButton" {...this.props}>
        {this.props.children}
      </MuiButton>
    );
  }
}

export default Button;
