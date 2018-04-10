import React from 'react';
import './css/loginform.css';
import {Link} from 'react-router-dom';
import history from './history';

// necessary for storing reusing session cookies properly
var fetchOptions = {
  method: 'GET',
  credentials: 'include'
}

class LoginForm extends React.Component{
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div>
        <h3>Taskr</h3>
        <div id="login-form">
          <form id="username-input">
            <input type="text" required ref="username" placeholder="Username"/>
          </form>
          <form id="password-input" onSubmit={this.handleSubmit}>
            <input type="password" required ref="password" placeholder="Password" />
            <input type="submit" value="Login"/>
          </form>
        </div>
      </div>
    );
  }

  handleSubmit(e){
    e.preventDefault();
    var url = `http://localhost:3000/login/${this.refs.username.value}/${this.refs.password.value}`
    fetch(url, fetchOptions).then(function(response) {
      if (response.ok) {
        history.push('/user');
      } else {
        alert('Invalid username or password');
        this.refs.username.value = '';
        this.refs.password.value = '';  
      }
    });
  }
}

module.exports = LoginForm;
