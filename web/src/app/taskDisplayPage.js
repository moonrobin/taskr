import React from 'react';
import {Link} from 'react-router-dom';
import history from './history';

import DetailItem from './detailItem.js';
import mockData from './mockdata/data2.js';
import './css/displaypage.css'; 

var d = {
  "title":  "Title",
  "description":  "Description",
  "requestor":  "Requestor",
  "currentbid": "Current Bid",
  "acceptbid": "Accept Bid",
  "accepttime": "Accept Time",
  "taskstarttime": "Task Start Time",
  "taskendtime":  "Task End Time"
};

class TaskDisplayPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: mockData
    };
    this.bidTask = this.bidTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  bidTask() {

  }

  deleteTask() {

  }

  render() {
    var rows = [];
    rows.push();
    for(var key in mockData) {
      if(key != "id" && mockData[key] != null) {
        var row = <DetailItem attr={d[key]} value={mockData[key]}/>;
        rows.push(row);
      }
    }
    return(
      <div>
        <h3>Task Details</h3>
        {rows}
        <button id="bid-button" type="button" onClick={this.bidTask}>Bid</button>
        <button id="delete-button" type="button" onClick={this.deleteTask}>Delete</button>
      </div>
    );
  }
}

module.exports = TaskDisplayPage;
