import React, {PureComponent} from 'react';

class Timer extends PureComponent {
  state = {
    time: Date.now(),
  }

  componentDidMount(){
    updateTime();
    this.interval = window.setInterval(this.updateTime, 1000);
  }

  componentWillUnmount(){
    if (this.interval) window.clearInterval(this.interval);
  }

  updateTime = () => this.setState({time: Date.now()});

  render = () => {
    const {startTime} = this.props;
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const sec = duration % 60;
    const min = Math.floor(duration / 60) % 60;
    return <span>{`${min}:${sec}`}</span>;
  }
}
