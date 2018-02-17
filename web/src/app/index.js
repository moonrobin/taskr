import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import {BrowserRouter, Route, Link} from 'react-router-dom';

var LoginForm = require('./loginForm');
var MockProfile = require('./mockProfile');
var CreateProfile = require('./createProfile');

class App extends React.Component{
  render(){
    return(
    <BrowserRouter>
      <div>
         <Route exact path="/" component={LoginForm} />
         <Route exact path="/profile" component={MockProfile} />
         <Route exact path="/create" component={CreateProfile} />
      </div>
    </BrowserRouter> 
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));