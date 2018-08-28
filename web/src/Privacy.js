import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Button from './Button';

class Privacy extends Component {
  render(){
    return (
      <div>
        <p>We use the collected data to determine which study wins and to evaluate our event. Anonymous statistics as well as potentially uploaded pictures will be kept for future marketing.</p>
        <Link to="/" style={{textDecoration: 'none'}}><Button>Home</Button></Link>
      </div>
    );
  }
}

export default Privacy;
