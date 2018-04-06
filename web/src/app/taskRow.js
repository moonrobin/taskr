import React from 'react';

import './css/taskrow.css';

class TaskRow extends React.Component {
  constructor(props) {
    super(props);
    this.popup = this.popup.bind(this);
  }

  popup() {
    var url = `/task/${this.props.id}`
    window.open('/task', '_blank');
  }

  render() {
    if(this.props.header) {
      return(
        <div>
          <div id='item-box'>
            <div id='name'>
              {this.props.title}
            </div>
          </div>
          <div id='item-box'>
            <div id='desc'>
              {this.props.desc}
            </div>
          </div>
          <div id='item-box'>
            <div id='requestor-id'>
              {this.props.requestorId}
            </div>
          </div>
          <div id='item-box'>
            <div id='current-bid'>
              {this.props.currentBid}
            </div>
          </div>
          <div id='item-box'>
            <div id='details'>
              Details
            </div>
          </div>
        </div>
      );
    }
    return(
      <div id='row'>
        <div id='item-box'>
          <div id='name'>
            {this.props.name}
          </div>
        </div>
        <div id='item-box'>
          <div id='desc'>
            {this.props.desc}
          </div>
        </div>
        <div id='item-box'>
          <div id='requestor-id'>
            {this.props.requestorId}
          </div>
        </div>
        <div id='item-box'>
          <div id='current-bid'>
            {this.props.currentBid === -1 ? "no bids" : `$ ${this.props.currentBid}`}
          </div>
        </div>
        <div id='item-box'>
          <button id="details-button" type="button" onClick={this.popup}>Details</button>
        </div>
      </div>
    );
  }
}

module.exports = TaskRow;
