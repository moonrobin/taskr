import React from 'react';

import './css/taskrow.css';

class TaskRow extends React.Component {
  constructor(props) {
    super(props);
    this.popupDetails = this.popupDetails.bind(this);
    this.popupUpdate = this.popupUpdate.bind(this);
    this.delete = this.delete.bind(this);
  }

  popupUpdate() {
    var url;
    url = `/update/${this.props.id}`
    window.open( url, '_blank');
  }

  popupDetails() {
    var url;
    url = `/task/${this.props.id}`
    window.open( url, '_blank');
  }

  delete(){
    var taskId = this.props.id;
    var deleteApiUrl = `http://localhost:3000/deletetask/${taskId}`;
    var that = this;
    fetch( deleteApiUrl, { method: 'DELETE', credentials:'include'}).then( function(res){
      if(res.ok){
        alert('Task deleted!');
        that.props.onDelete( that.props.key );
      }
    });
  }

  renderDeleteButton() {
    return (
      <div id='item-box'>
        <div id='delete'>
          <button id="delete-button" type="button" onClick={this.delete.bind(this)}>Delete</button>
        </div>
      </div>
    );
  }

  render() {
    var updateButton = null;
    if( this.props.type == "update" ){
      updateButton = <button id="details-button" type="button" onClick={this.popupUpdate}>Edit</button>;
    }
    if(this.props.header) {
      return(
        <div>
          <div id='item-box'>
            <div id='name'>
              {this.props.title}
            </div>
          </div>
          <div id='item-box'>
            <div id='requester'>
              {this.props.requester}
            </div>
          </div>
          <div id='item-box'>
            <div id='start-time'>
              {this.props.taskstarttime}
            </div>
          </div>
          <div id='item-box'>
            <div id='end-time'>
              {this.props.taskendtime}
            </div>
          </div>
          <div id='item-box'>
            <div id='accept-time'>
              {this.props.accepttime}
            </div>
          </div>
          <div id='item-box'>
            <div id='starting-bid'>
              {this.props.startbid}
            </div>
          </div>
          <div id='item-box'>
            <div id='accept-bid'>
              {this.props.acceptbid}
            </div>
          </div>
          <div id='item-box'>
            <div id='current-bid'>
              {this.props.currentbid}
            </div>
          </div>
          <div id='item-box'>
            <div id='status'>
              {this.props.state}
            </div>
          </div>
          <div id='item-box'>
            <div id='details'>
              {this.props.details}
            </div>
          </div>
        </div>
      );
    } else if (this.props.empty) {
      return(
        <div id='row'>
          No tasks were found.
        </div>
      );
    }

    return(
      <div id='row'>
        <div id='item-box'>
          <div id='name'>
            {this.props.title}
          </div>
        </div>
        <div id='item-box'>
          <div id='requester'>
            {this.props.requester}
          </div>
        </div>
        <div id='item-box'>
          <div id='start-time'>
            {this.props.taskstarttime}
          </div>
        </div>
        <div id='item-box'>
          <div id='end-time'>
            {this.props.taskendtime}
          </div>
        </div>
        <div id='item-box'>
          <div id='accept-time'>
            {this.props.accepttime}
          </div>
        </div>
        <div id='item-box'>
          <div id='starting-bid'>
            {this.props.startbid == null ? "None" : `$${this.props.startbid}`}
          </div>
        </div>
        <div id='item-box'>
          <div id='accept-bid'>
            {this.props.acceptbid == null ? "None" : `$${this.props.acceptbid}`}
          </div>
        </div>
        <div id='item-box'>
          <div id='current-bid'>
            {this.props.currentbid == null ? "No Bids" : `$${this.props.currentbid}`}
          </div>
        </div>
        <div id='item-box'>
          <div id='status'>
            {this.props.state}
          </div>
        </div>
        <div id='item-box'>
          <div id='details'>
            <button id="details-button" type="button" onClick={this.popupDetails}>Details</button>
          </div>
          {updateButton}
        </div>
        {this.props.type === "update" && this.renderDeleteButton()}
      </div>
    );
  }
}

module.exports = TaskRow;
