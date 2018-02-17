import React from 'react';
import './css/loginform.css';
import {Link, withRouter} from 'react-router-dom';

class LoginForm extends React.Component{
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(){
    return(
      <div>
        <Link to={'/create'}>Create Account</Link>
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
        //TODO make this redirect
      }
    });
  }
}

module.exports = withRouter(LoginForm);
