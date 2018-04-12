import React from 'react';
import {Link} from 'react-router-dom';
import history from './history';

import DetailItem from './detailItem.js';
import mockData from './mockdata/data2.js';
import MenuBar from './menuBar.js';
import './css/displaypage.css'; 

var d = {
  "title":  "Title",
  "description":  "Description",
  "requester":  "Requestor",
  "startbid": "Starting Bid",
  "currentbid": "Current Bid",
  "acceptbid": "Accept Bid",
  "accepttime": "Accept Time",
  "taskstarttime": "Task Start Time",
  "taskendtime":  "Task End Time",
  "state": "Task Status",
  "awardedto": "Awarded to"
};

class TaskDisplayPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      taskId: null,
      admin: false,
      user:null,
      awardedto: null
    };
    this.queryTask = this.queryTask.bind(this);
    this.bidTask = this.bidTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.completeTask = this.completeTask.bind(this);
    this.checkAdmin = this.checkAdmin.bind(this);
    this.queryTask();
    this.checkAdmin();
  }

  // checks if current user is an admin / user has complete privileges
  checkAdmin(){
    var userApiUrl = `http://localhost:3000/user`;
    var that = this;
    return fetch( userApiUrl, { method: 'GET', credentials:'include'})
    .then( function(res){
      return res.json();
    }).then( function(resjson){
      // console.log(resjson[0].admin);
      console.log( resjson);
      that.setState({
        admin: resjson[0].admin,
        user: resjson[0].username
      });
    });
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
      console.log( resjson);
        data = resjson;
        that.setState({
          data: data[0],
          taskId: taskId,
          awardedto: data[0].awardedto
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
    // TODO: confirmation delete
    var deleteTaskApiUrl = `http://localhost:3000/deletetask/${this.state.taskId}`;
    fetch( deleteTaskApiUrl, {method: 'POST', credentials:'include'})
    .then( function(rest){
      if( res.ok ){
        alert('Task deleted');
      } else {
        alert('Couldn\'t delete task')
      }
    })
  }

  completeTask() {
    var apiUrl = `http://localhost:3000/updatetask/
    ${this.state.taskId}/?state=complete`;
    var that = this;
    fetch( apiUrl, { method: 'POST', credentials:'include'})
    .then(function(res){
        if( res.ok ){
          alert('Completed task succesfully');
          that.queryTask();
        } else {
          alert('Failed to complete task');
        }
    })
  }

  render() {
    var rows = [];
    for(var key in this.state.data) {
      if(key != "id" && this.state.data[key] != null) {
        var row = <DetailItem key={key} field={key} attr={d[key]} value={this.state.data[key]}/>;
        rows.push(row);
      }
    }

    var deleteButton = <button id="delete-button" type="button" onClick={this.deleteTask}>Delete</button>;
    deleteButton = this.state.admin ? deleteButton : null;

    var completeButton = null; 
    console.log (this.state);
    if ( this.state.user && this.state.awardedto ){
      if ( this.state.user === this.state.awardedto){
          completeButton = <button id="complete-button" type="button" onClick={this.completeTask}>Complete</button>;
        }
    }

    if ( !rows.length ){
      return(
        <div>
        <MenuBar/>
          <h3>Task Details</h3>
          <p>Task not found</p>
        </div>
      );
    }

    return(
      <div>
        <MenuBar/>
        <h3>Task Details</h3>
        {rows}
        <div id="taskfieldvalue" style={{display:'inline-block'}}>
          <input type="number" min="0" ref="bidproposal" placeholder="Place a bid..."/>
        </div>
        <button id="bid-button" type="button" onClick={this.bidTask}>Bid</button>
        {deleteButton}
        {completeButton}

      </div>
    );
  }
}

module.exports = TaskDisplayPage;
