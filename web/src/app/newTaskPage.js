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
    var title = this.refs.tasktitle.value;
    var desc = this.refs.desc.value;
    var acceptbid = this.refs.acceptbid.value;
    var startingbid = this.refs.startingbid.value;
    var starttime = this.refs.starttime.value;
    var accepttime = this.refs.accepttime.value;
    var endtime = this.refs.endtime.value;

    // use new task api
    var api_url = `http://localhost:3000/`+
    `createtask/${title}/${startingbid}/${endtime}?`;
    if ( accepttime ){
      api_url +=  `&accepttime=${accepttime}`;
    }
    if ( desc ){
      api_url += `&description=${desc}`;``
    }
    if ( starttime ){
      api_url += `&starttime=${starttime}`;
    }

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
              <div id="taskfieldname">Task Title (required)</div>
              <div id="taskfieldvalue"> 
                <input type="text" ref="tasktitle" placeholder="Briefly describe the task"/>
              </div>
              <div id="taskfieldname">Accept Bid </div>
              <div id="taskfieldvalue"> 
                <input type="number" min="0" ref="acceptbid" placeholder="Name an accept bid price"/>
              </div>
              <div id="taskfieldname">Starting Bid (required)</div>
              <div id="taskfieldvalue"> 
                <input type="number" min="0" ref="startingbid" placeholder="Name a starting bid price"/>
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
              <div id="taskfieldvalue"> 
                <div id="timefield">
                  <div id="taskfieldname">Finish bidding at:</div>
                  <input id="accept" ref="accepttime" type="datetime-local" />
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
