import React from 'react';
import {Link} from 'react-router-dom';

import MenuBar from './menuBar.js';
import DetailItem from './detailItem.js';

var d = {
  "name":  "Name",
  "username":  "Username",
  "score":  "Score",
  // "admin": "User Privilege",
};

class UserProfile extends React.Component{
  	constructor(props) {
		super(props);
		this.state = {
			name: null,
			score: null,
			username: null,
			admin: null
		};
		this.handleLogout = this.handleLogout.bind(this);
		this.fetch();
	}

	fetch(e) {
	    if (e){ 
	      e.preventDefault();
	    }
	    var currentUrl = window.location.href;
	    var api_url = `http://localhost:3000/user`;
      	var matches = /user\/(\w+?)\b/.exec(currentUrl); 
      	if( matches ){
      		api_url += `?username=${matches[1]}`;
      	}


	    var that = this;
	    fetch(api_url, { method: 'GET', credentials:'include'}).then(function(res) {
	        return res.json();
	    }).then(function(resjson) {
	        console.log( resjson[0] ); 
	        that.setState({
	          name: resjson[0].name,
	          score: resjson[0].score,
	          username: resjson[0].username,
	          admin: resjson[0].admin
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
	    var rows = [];
	    for(var key in this.state) {
	      if(key != "id" && this.state[key] != null) {
	        var row = <DetailItem attr={d[key]} value={this.state[key]}/>;
	        rows.push(row);
	      }
	    }

		return(
	      <div>
	      	<MenuBar/>
	      	<h3>Profile</h3>
	      	{rows}
	        <Link to={'/'} onClick={this.handleLogout}>Logout</Link>
	      </div>
	    );
 	}
}

module.exports = UserProfile;
