import React from 'react';
import './css/createprofile.css';
import {Link} from 'react-router-dom';
import history from './history';

class CreateProfile extends React.Component{
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(){
    return(
      <div>
        <h3>Create Account</h3>
        <div id='login-link'>
          <Link to={'/'}>Back To Login</Link>
        </div>
        <div id="create-profile-form">
          <form id="username-input">
            <input type="text" required ref="username" placeholder="Username"/>
          </form>          <form id="name-input">
            <input type="text" required ref="name" placeholder="Name"/>
          </form>
          <form id="password-input" >
            <input type="password" required ref="password" placeholder="Password" />
          </form>
          <form id="password-confirm-input" onSubmit={this.handleSubmit}>
            <input type="password" required ref="passwordConfirm" placeholder="Confirm Password" />
            <input type="submit" value="Create"/>
          </form>
        </div>
      </div>
    );
  }

  handleSubmit(e){
    e.preventDefault();
    var password = this.refs.password.value;
    var confirmPassword = this.refs.passwordConfirm.value;

    if (password == confirmPassword){
      var url = `http://localhost:3000/createuser/${this.refs.username.value}/${this.refs.password.value}/${this.refs.name.value}`
      fetch(url,{method: "POST"}).then(function(response) {
        if (response.ok) {
          console.log('User Created');
          history.push('/');
        }else{
          alert('User already exists');
        }
      });
    }else{
      alert('Passwords do not match');
      this.refs.username.value = '';
      this.refs.password.value = '';
      this.refs.passwordConfirm.value = '';
    }


  }

}

module.exports = CreateProfile;
