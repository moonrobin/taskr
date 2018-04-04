import React from 'react';

import './css/detailitem.css';

class DetailItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id='row'>
        <div id='item-box'>
          <div id='attr'>
            {this.props.attr}
          </div>
        </div>
        <div id='item-box'>
          <div id='value'>
            {this.props.value}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = DetailItem;
