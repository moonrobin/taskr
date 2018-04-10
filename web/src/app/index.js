import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import History from './history';
import {Router, Route, Link} from 'react-router-dom';

var LoginForm = require('./loginForm');
var MockProfile = require('./mockProfile');
var CreateProfile = require('./createProfile');
var TaskSearchPage = require('./taskSearchPage');
var TaskDisplayPage = require('./taskDisplayPage');
var MyTasksPage = require('./myTasksPage');
var MyBidsPage = require('./myBidsPage');
var NewTaskPage = require('./newTaskPage');
var UpdateTaskPage = require('./updateTaskPage');

class App extends React.Component{
  render(){
    return(
    <Router history={History}>
      <div>
         <Route exact path="/" component={LoginForm} />
         <Route exact path="/create" component={CreateProfile} />
         <Route exact path="/profile" component={MockProfile} />
         <Route exact path="/search" component={TaskSearchPage} />
         <Route exact path="/task/*" component={TaskDisplayPage} />
         <Route exact path="/update/*" component={UpdateTaskPage} />
         <Route exact path="/newtask" component={NewTaskPage} />
         <Route exact path="/mytasks" component={MyTasksPage} />
         <Route exact path="/mybids" component={MyBidsPage} />
      </div>    
    </Router> 
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
