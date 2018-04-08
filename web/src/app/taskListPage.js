import React from 'react';
import {Link} from 'react-router-dom';
import history from './history';

import TaskRow from './taskRow.js';
import './css/tasklistpages.css';

class TaskListPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
    this.renderList = this.renderList.bind(this);
  }

  renderList() {
    var rows = [];
    rows.push();
    for (var key in this.state.data ) {
      var row = <TaskRow {...this.state.data[key]}/>;
      rows.push(row);
    }

    var header = 
        <div id='task-listing-header'>
          <TaskRow header title="Task"
                          requester="Requester"
                          taskstarttime="Start Time"
                          taskendtime="End Time"
                          currentbid="Current Bid"
                          details="Details"/>
        </div>;
    rows = rows.length ? rows : <TaskRow empty="True" ondelete={this.renderList}/>
    return(
      <div id='task-listing'>
        {header}
        {rows}
      </div>
    );
  }

  render() {
    return(
      <div>
        <h3>Search Tasks</h3>
        <div>
          <form id="query" onSubmit={this.querySubmit}>
              <input type="text" ref="querytitle" placeholder="Search tasks..."/>
              <div id="timefield">
                <label>Start time</label><br/>
                <input id="start" ref="starttime" type="datetime-local" />
              </div>
              <div id="timefield">
                <label>End time</label><br/>
                <input id="end" ref = "endtime"type="datetime-local" />
              </div>
              <button id="submit" type="button" onClick={this.querySubmit}>Search</button>
          </form>
        </div>
        {this.state.data && this.renderList()}
      </div>
    );
  }
}

module.exports = TaskListPage;
