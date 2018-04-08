import React from 'react';
import {Link} from 'react-router-dom';
import history from './history';

import TaskRow from './taskRow.js';
import './css/tasklistpages.css';
import TaskListPage from './taskListPage.js';

class MyTasksPage extends TaskListPage{
  constructor(props) {
    super(props);
    this.querySubmit = this.querySubmit.bind(this);
    this.querySubmit();
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
        <h3>My Requested Tasks</h3>
        {this.state.data && this.renderList()}
      </div>
    );
  }
}

module.exports = MyTasksPage;
