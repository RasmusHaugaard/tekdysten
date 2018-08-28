import React, { Component } from 'react';
import './Header.css';
import SIFlogo from './SIFlogo.png';

class Header extends Component {
  render() {
    return (
      <header className={"Header" + (this.props.small ? " small" : "")}>
        <img className="Header-logo" src={SIFlogo} alt="SIF logo"/>
        <h1 className="Header-title"><span className="Header-title-span">TEKDYSTEN</span></h1>
        <p className="Header-place">
          at the slaughter house
        </p>
        <p className="Header-time">
          31/8 - 2pm
        </p>
      </header>
    );
  }
}

export default Header;
