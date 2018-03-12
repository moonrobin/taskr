import React from 'react';
import './css/loginform.css';
import {Link} from 'react-router-dom';
import history from './history';

class LoginForm extends React.Component{
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div>
        <Link to={'/create'}>Create Account</Link>
        <Link to={'/tasks'}>Tasks</Link>
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
    fetch(url).then(function(response) {
      if (response.ok) {
        history.push('/profile');
      } else {
        alert('Invalid username or password');
        this.refs.username.value = '';
        this.refs.password.value = '';  
      }
    });
  }
}

module.exports = LoginForm;
