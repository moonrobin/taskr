import React from 'react';

import './css/displaypage.css';

class DetailItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id='detail-row'>
        <div id='detail-box'>
          <div id='attr'>
            {this.props.attr}
          </div>
        </div>
        <div id='detail-box'>
          <div id='value'>
            {this.props.value}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = DetailItem;
