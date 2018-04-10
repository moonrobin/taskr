import React from 'react';
import {Link} from 'react-router-dom';

import MenuBar from './menuBar.js';

class UserProfile extends React.Component{
  	constructor(props) {
		super(props);
		this.state = {
			data: null
		};
		this.handleLogout = this.handleLogout.bind(this);
		this.fetch();
	}

	fetch(e) {
	    if (e){ 
	      e.preventDefault();
	    }
	    var api_url = `http://localhost:3000/score`;
	    var data;
	    var that = this;
	    fetch(api_url, { method: 'GET', credentials:'include'}).then(function(res) {
	        return res.json();
	    }).then(function(resjson) {
	        data = resjson;
	        that.setState({
	          data: data[0]['score']
	        });
	    });
	}

	handleLogout() {
	    // this will clear the session cookies.
	    fetch('http://localhost:3000/logout', {method: "GET", credentials: 'include' }).then(function(response){
	    	if (response.ok) {
	        	console.log('Logout successful');
	    	} else {
	        	console.log('Logout failed!');
	    	}
	    });
	}

	render() {
		return(
	      <div>
	      	<MenuBar/>
	      	<div id="label">{`Score: ${this.state.data}`}</div>
	        <Link to={'/'} onClick={this.handleLogout}>Logout</Link>
	      </div>
	    );
 	}
}

module.exports = UserProfile;
