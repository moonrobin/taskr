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
      data: null,
      taskId: null
    };
    this.queryTask = this.queryTask.bind(this);
    this.bidTask = this.bidTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.queryTask();
  }

  queryTask(){
    var currentUrl = window.location.href;
    console.log(currentUrl);
    var matches = /task\/(\d+?)\b/.exec(currentUrl);
    var taskId = matches[1];


    var formedApiUrl = `http://localhost:3000/`+
    `tasks?taskid=${taskId}`;

    var data; 
    var that = this;
    fetch( formedApiUrl, { method: 'GET', credentials:'include'})
    .then(function(res){
        return res.json();
    }).then( function(resjson){
        data = resjson;
        that.setState({
          data: data[0],
          taskId: taskId
        });
    });   

  }

  bidTask() {
    var bid = this.refs.bidproposal.value;

    var createBidApiUrl = `http://localhost:3000/bid/${this.state.taskId}/${bid}/`;

    var that = this;

    fetch( createBidApiUrl, { method: 'POST', credentials:'include'})
    .then(function(res){
        if( res.ok ){
          alert('Bid placed succesfully');
          that.queryTask();
        } else {
          alert('Invalid Bid: bid must be lower than current bid and on a currently valid task');
        }
    })
  }

  deleteTask() {
    var deleteTaskApiUrl = `http://localhost:3000`;
  }

  render() {
    var rows = [];
    for(var key in this.state.data) {
      if(key != "id" && mockData[key] != null) {
        var row = <DetailItem attr={d[key]} value={this.state.data[key]}/>;
        rows.push(row);
      }
    }

    if ( !rows.length ){
      return(
        <div>
          <h3>Task Details</h3>
          <p> Task not found </p>
        </div>
      );
    }

    return(
      <div>
        <h3>Task Details</h3>
        {rows}
        <div id="taskfieldvalue" style={{display:'inline-block'}}>
          <input type="number" min="0" ref="bidproposal" placeholder="Place a bid..."/>
        </div>
        <button id="bid-button" type="button" onClick={this.bidTask}>Bid</button>
        <button id="delete-button" type="button" onClick={this.deleteTask}>Delete</button>
      </div>
    );
  }
}

module.exports = TaskDisplayPage;
