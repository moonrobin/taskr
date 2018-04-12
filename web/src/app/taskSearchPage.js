import React from 'react';
import {Link} from 'react-router-dom';
import history from './history';

import MenuBar from './menuBar.js';
import TaskListPage from './taskListPage.js';
import TaskRow from './taskRow.js';
import './css/tasklistpages.css';

class TaskSearchPage extends TaskListPage{
  constructor(props) {
    super(props);
    this.querySubmit = this.querySubmit.bind(this);
    this.checkAdmin = this.checkAdmin.bind(this);
    this.checkAdmin();
  }

  // checks if current user is an admin.
  checkAdmin(){
    var userApiUrl = `http://localhost:3000/user`;
    var that = this;
    return fetch( userApiUrl, { method: 'GET', credentials:'include'})
    .then( function(res){
      return res.json();
    }).then( function(resjson){
      // console.log(resjson[0].admin);
      that.setState({
        admin: resjson[0].admin
      });
    });
  }

  querySubmit(e){
    e.preventDefault();
    var title = this.refs.querytitle.value;
    var startTime = this.refs.starttime.value;
    var endTime = this.refs.endtime.value;

    var api_url = `http://localhost:3000/`+
    `tasks?taskstarttime=${startTime}`+
    `&taskendtime=${endTime}&titlequery=${title}`;

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
        <h3>Search Tasks</h3>
        <div>
          <form id="query" onSubmit={this.querySubmit}>
            <div>
              <input type="text" ref="querytitle" placeholder="Search tasks..."/>
            </div>
            <div id="timefield">
              <label>Start time</label><br/>
              <input id="start" ref="starttime" type="datetime-local" />
            </div>
            <div id="timefield">
              <label>End time</label><br/>
              <input width="5" id="end" ref="endtime" type="datetime-local" />
            </div>
            <button id="submit" type="button" onClick={this.querySubmit}>Search</button>
          </form>
        </div>
        {this.state.data && this.renderList()}
      </div>
    );
  }
}

module.exports = TaskSearchPage;
