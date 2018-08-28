import React, {PureComponent} from 'react';
import ActivityHeader from './ActivityHeader';
import FireProvider from './FireProvider';

class ActivityStationHeader extends PureComponent {
  render = () => (
    <FireProvider
      propName='activity'
      path={`activities/${this.props.activity}`}
      alt={{displayName: ''}}
    >
      <ActivityHeader
        altTitle={this.props.title}
        altSubtitle={this.props.subtitle}
      />
    </FireProvider>
  );
}

export default ActivityStationHeader;
