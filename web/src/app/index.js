import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import History from './history';
import {Router, Route, Link} from 'react-router-dom';

var LoginForm = require('./loginForm');
var MockProfile = require('./mockProfile');
var CreateProfile = require('./createProfile');
var TaskDisplayPage = require('./taskDisplayPage');

class App extends React.Component{
  render(){
    return(
    <Router history={History}>
      <div>
         <Route exact path="/" component={LoginForm} />
         <Route exact path="/create" component={CreateProfile} />
         <Route exact path="/profile" component={MockProfile} />
         <Route exact path="/tasks" component={TaskDisplayPage} />
      </div>    
    </Router> 
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
