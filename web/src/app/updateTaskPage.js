import React from 'react';
import {Link} from 'react-router-dom';
import history from './history';
import './css/newtaskpage.css';
import MenuBar from './menuBar.js';

class UpdateTaskPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      taskId: null
    }; 

    this.querySubmit = this.querySubmit.bind(this);
    this.getTaskInfo = this.getTaskInfo.bind(this);
    this.getTaskInfo();
  }

  querySubmit(){
    var desc = this.refs.desc.value;
    var acceptbid = this.refs.acceptbid.value;
    var accepttime = this.refs.accepttime.value;

    // use new task api
    var api_url = `http://localhost:3000/`+
    `updatetask/${this.state.taskId}?`;
    if ( acceptbid ){
      api_url +=  `&acceptbid=${acceptbid}`;
    }
    if ( desc ){
      api_url += `&description=${desc}`;
    }
    if ( accepttime ){
      api_url += `&accepttime=${accepttime}`;
    }

    var data; 
    var that = this;
    fetch( api_url, { method: 'POST', credentials:'include'})
    .then(function(res){
      if (res.ok){
        alert('Task succesfully updated!');
      } else {
        alert('Invalid update: check your fields and try again.');
      }
    })
  }

  getTaskInfo(){
    var currentUrl = window.location.href;
    console.log(currentUrl);
    var matches = /update\/(\d+?)\b/.exec(currentUrl);
    var taskId = matches[1];


    var taskApiUrl = `http://localhost:3000/tasks?taskid=${taskId}`;
    var data; 
    var that = this;

    fetch( taskApiUrl, { method: 'GET', credentials:'include'})
    .then(function(res){
      if (!res.ok){
        console.log('could\'nt get task info');
      } else {
        return res.json();
      }
    }).then( function(resjson){
      data = resjson;
      that.setState({
        data: data[0],
        taskId: taskId
      })
    })
  }

  render() {
    if (!this.state.data){
      return(
        <div>
        <MenuBar/>
          <h3>Update Task</h3>
          <p>Task not found</p>
        </div>
      );
    }
    return(
      <div>
        <MenuBar/>
        <h3>Update Existing Task</h3>
        <div>
          <form className="updateform" id="query" onSubmit={this.querySubmit}>
              <div id="taskfieldname">Task Title (required)</div>
              <div id="taskfieldvalue"> 
                <input disabled className="readonly" value={this.state.data.title} type="text" readOnly="true" ref="tasktitle" placeholder="Briefly describe the task"/>
              </div>
              <div id="taskfieldname">Accept Bid </div>
              <div id="taskfieldvalue"> 
                <input defaultValue={this.state.data.acceptbid} type="number" min="0" ref="acceptbid" placeholder="Name an accept bid price"/>
              </div>
              <div id="taskfieldname">Starting Bid (required)</div>
              <div id="taskfieldvalue"> 
                <input disabled className="readonly" value={this.state.data.startbid} type="number" readOnly="true" min="0" ref="startingbid" placeholder="Name a starting bid price"/>
              </div>
              <div id="taskfieldname">Task Description</div>
              <div id="taskfieldvalue"> 
                <textarea defaultValue={this.state.data.description} maxLength="500" name="descbox" ref="desc" id="taskdesc" placeholder="Describe the task in length"></textarea>
              </div>
              <div id="taskfieldvalue"> 
                <div id="timefield">
                  <div id="taskfieldname">Start Time</div>
                  <input disabled className="readonly" value={this.state.data.starttime || undefined} id="start" ref="starttime" type="datetime-local" />
                </div>
              </div>
              <div id="taskfieldvalue"> 
                <div id="timefield">
                  <div id="taskfieldname">End Time (required)</div>
                  <input disabled className="readonly"  value={this.state.data.endtime || undefined }id="end" ref = "endtime"type="datetime-local" />
                </div>
              </div>
              <div id="taskfieldvalue"> 
                <div id="timefield">
                  <div id="taskfieldname">Finish bidding at:</div>
                  <input disabled className="readonly" value={this.state.data.accepttime || undefined} id="accept" ref="accepttime" type="datetime-local" />
                </div>
              </div>
              <div id="submitbutton">
                <button id="submit" type="button" onClick={this.querySubmit}>Update Task</button>
              </div>
          </form>
        </div>
      </div>
    );
  }
}

module.exports = UpdateTaskPage;
