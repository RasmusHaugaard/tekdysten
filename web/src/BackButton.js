import React, {PureComponent} from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';

class BackButton extends PureComponent {
  render(){
    const style = {
      position: 'absolute',
      top: '1.3rem',
      left: '1.3rem',
    };
    const props = {style, ...this.props};
    return <ArrowBackIcon {...props} />
  }
}

export default BackButton;
