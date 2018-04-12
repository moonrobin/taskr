import React from 'react';
import {Link} from 'react-router-dom';

import './css/displaypage.css';

class DetailItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var val = this.props.value;
    if (this.props.field === 'requester'
      || this.props.field === 'awardedto'
      || this.props.field === 'username'){
      val = <Link to={`/user/${this.props.value}`}>{this.props.value}</Link>;
    } else if (this.props.field === 'acceptbid'
      || this.props.field === 'startbid'
      || this.props.field === 'currentbid'){
      val = `$${this.props.value}`;
    }
    return(
      <div id='detail-row'>
        <div id='detail-box'>
          <div id='attr'>
            {this.props.attr}
          </div>
        </div>
        <div id='detail-box'>
          <div id='value'>
            {val}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = DetailItem;
