import React from 'react';
import {Link} from 'react-router-dom';

class UserProfile extends React.Component{
  	constructor(props) {
	super(props);
	    this.handleLogout = this.handleLogout.bind(this);
	}

	render(){
	    return(
	      <div>
	        <Link to={'/'} onClick={this.handleLogout}>Logout</Link>
	        <p> Successfully logged in! </p>
	      </div>
	    );
 	}

	handleLogout(){
	    // this will clear the session cookies.
	    fetch('http://localhost:3000/logout', {method: "GET", credentials: 'include' }).then(function(response){
	      if (response.ok) {
	        console.log('Logout successful');
	      } else {
	        console.log('Logout failed!');
	      }
	    });
	  }
}

module.exports = UserProfile;
