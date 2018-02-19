import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import History from './history';
import {Router, Route, Link} from 'react-router-dom';

var LoginForm = require('./loginForm');
var MockProfile = require('./mockProfile');
var CreateProfile = require('./createProfile');

class App extends React.Component{
  render(){
    return(
    <Router history={History}>
      <div>
         <Route exact path="/" component={LoginForm} />
         <Route exact path="/profile" component={MockProfile} />
         <Route exact path="/create" component={CreateProfile} />
      </div>    
    </Router> 
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
