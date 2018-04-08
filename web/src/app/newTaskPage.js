import React from 'react';
import {Link} from 'react-router-dom';
import history from './history';
import './css/newtaskpage.css';

class NewTaskPage extends React.Component{
  constructor(props) {
    super(props);
    this.querySubmit = this.querySubmit.bind(this);
  }

  querySubmit(e){
    e.preventDefault();
    var title = this.refs.querytitle.value;
    var desc = this.refs.desc.value;
    var acceptbid = this.refs.acceptbid;
    var startingbid = this.refs.startingbid;
    var startTime = this.refs.starttime.value;
    var endTime = this.refs.endtime.value;

    // use new task api
    var api_url = `http://localhost:3000/`+
    `createtask/${title}/${acceptbid}/${endtime}`+
    `&accepttime=${starttime}&description=${desc}`;

    var data; 
    var that = this;
    fetch( api_url, { method: 'POST', credentials:'include'})
    .then(function(res){
      if (res.ok){
        console.log('task created successfully');
      }
    })
  }

  render() {
    return(
      <div>
        <h3>New Task</h3>
        <div>
          <form id="query" onSubmit={this.querySubmit}>
              <div id="taskfieldname">Task Title</div>
              <div id="taskfieldvalue"> 
                <input type="text" ref="tasktitle" placeholder="Briefly describe the task"/>
              </div>
              <div id="taskfieldname">Accept Bid (required)</div>
              <div id="taskfieldvalue"> 
                <input type="text" ref="acceptbid" placeholder="Name an accept bid price"/>
              </div>
              <div id="taskfieldname">Starting Bid (required)</div>
              <div id="taskfieldvalue"> 
                <input type="text" ref="startingbid" placeholder="Name a starting bid price"/>
              </div>
              <div id="taskfieldname">Task Description</div>
              <div id="taskfieldvalue"> 
                <textarea maxLength="500" name="descbox" ref="desc" id="taskdesc" placeholder="Describe the task in length"></textarea>
              </div>
              <div id="taskfieldvalue"> 
                <div id="timefield">
                  <div id="taskfieldname">Start Time</div>
                  <input id="start" ref="starttime" type="datetime-local" />
                </div>
              </div>
              <div id="taskfieldvalue"> 
                <div id="timefield">
                  <div id="taskfieldname">End Time (required)</div>
                  <input id="end" ref = "endtime"type="datetime-local" />
                </div>
              </div>
              <div id="submitbutton">
                <button id="submit" type="button" onClick={this.querySubmit}>Create New Task</button>
              </div>
          </form>
        </div>
      </div>
    );
  }
}

module.exports = NewTaskPage;
