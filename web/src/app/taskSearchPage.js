import React from 'react';
import {Link} from 'react-router-dom';
import history from './history';

import TaskRow from './taskRow.js';
import './css/tasklistpages.css';
import mockData from './mockdata/data.js';

class TaskSearchPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: null
    }
    this.querySubmit = this.querySubmit.bind(this);
  }

  querySubmit() {
    this.setState({data: mockData})
  }

  renderList() {
    var rows = [];
    rows.push();
    for (var key in mockData) {
      var row = <TaskRow {...mockData[key]}/>;
      rows.push(row);
    }
    return(
      <div id='task-listing'>
        <div id='task-listing-header'>
          <TaskRow header name="Task" desc="Description" requestorId="Requestor" currentBid="Current Bid"/>
        </div>
        {rows}
      </div>
    );
  }

  render() {
    return(
      <div>
        <h3>Search Tasks</h3>
        <div>
          <form id="query">
              <input type="text" placeholder="Search tasks..."/>
              <div id="timefield">
                <label>Start time</label><br/>
                <input id="start" type="datetime-local" />
              </div>
              <div id="timefield">
                <label>End time</label><br/>
                <input id="end" type="datetime-local" />
              </div>
              <button id="submit" type="button" value="Search" onClick={this.querySubmit}>Search</button>
          </form>
        </div>
        {this.state.data && this.renderList()}
      </div>
    );
  }
}

module.exports = TaskSearchPage;
