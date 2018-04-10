import React from 'react';
import {Link} from 'react-router-dom';
import history from './history';

import MenuBar from './menuBar.js';
import TaskListPage from './taskListPage.js';
import TaskRow from './taskRow.js';
import './css/tasklistpages.css';

class MyTasksPage extends TaskListPage{
  constructor(props) {
    super(props);
    this.querySubmit = this.querySubmit.bind(this);
    this.querySubmit();
  }

  renderList() {
    var rows = [];
    rows.push();
    for (var key in this.state.data ) {
      var row = <TaskRow {...this.state.data[key]} type="update"/>;
      rows.push(row);
    }

    var header = 
        <div id='task-listing-header'>
          <TaskRow header
              title="Task"
              requester="Requester"
              acceptbid="Accept Bid"
              startbid="Starting Bid"
              currentbid="Current Bid"
              taskstarttime="Start Time"
              taskendtime="End Time"
              accepttime="Bidding Ends"
              details="Details"/>
        </div>;
    rows = rows.length ? rows : <TaskRow empty/>
    return(
      <div id='task-listing'>
        {header}
        {rows}
      </div>
    );
  }

  querySubmit( e ){
    if (e){
      e.preventDefault();
    }
    var api_url = `http://localhost:3000/`+
    `tasks?requester=me`; // server side will determine user from cookies
    var data; 
    var that = this;
    fetch( api_url, { method: 'GET', credentials:'include'})
    .then(function(res){
        return res.json();
    }).then( function(resjson){
        data = resjson;
        that.setState({
          data: data
        });
    });
  }

  render() {
    return(
      <div>
        <MenuBar/>
        <h3>My Requested Tasks</h3>
        {this.state.data && this.renderList()}
      </div>
    );
  }
}

module.exports = MyTasksPage;
