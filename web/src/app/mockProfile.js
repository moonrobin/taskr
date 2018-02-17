import React from 'react';
import {Link} from 'react-router-dom';

class MockProfile extends React.Component{
  render(){
    return(
      <div>
        <Link to={'/'}>Logout</Link>
        <p> Successfully logged in! </p>
      </div>
    );
  }
}

module.exports = MockProfile;
