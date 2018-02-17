import React from 'react';
import './css/createprofile.css';
import {Link} from 'react-router-dom';

class CreateProfile extends React.Component{
  render(){
    return(
      <div>
        <Link to={'/'}>Login</Link>
                <div id="create-profile-form">
          <form id="username-input">
            <input type="text" required ref="username" placeholder="Username"/>
          </form>
          <form id="password-input" >
            <input type="password" required ref="password" placeholder="Password" />
          </form>
          <form id="password-confirm-input" >
            <input type="password" required ref="passwordConfirm" placeholder="Confirm Password" />
            <input type="submit" value="Create"/>
          </form>
        </div>
      </div>
    );
  }
}

module.exports = CreateProfile;
