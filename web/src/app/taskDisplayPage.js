import React from 'react';
import {Link} from 'react-router-dom';
import history from './history';

import './css/taskdisplaypage.css';
import mockData from './mockdata/data.js';

class TaskDisplayPage extends React.Component{
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
    for (var key in mockData) {
      rows.push(`${key} ${mockData[key]["name"]}. ${mockData[key]["desc"]}. Requestor: ${mockData[key]["requestorId"]}`);
    }
    return(
      <div>
        {rows}
      </div>
    );
  }

  render(){
    return(
      <div>
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
        <div>
          {this.state.data && this.renderList()}
        </div>
      </div>
    );
  }
}

module.exports = TaskDisplayPage;
