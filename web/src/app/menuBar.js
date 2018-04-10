import React from 'react';
import {Link} from 'react-router-dom';

import './css/menubar.css';

var style = {
  textDecoration: 'none',
  color: '#7f4cc1'
};

class MenuBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id='menu-bar-container'>
        <div id='menu-bar-item'>
          <Link to={'/search'} style={style}>Task Search</Link>
        </div>
        <div id='menu-bar-item'>
          <Link to={'/mytasks'} style={style}>My Tasks</Link>
        </div>
        <div id='menu-bar-item'>
          <Link to={'/mybids'} style={style}>My Bids</Link>
        </div>
        <div id='menu-bar-item'>
          <Link to={'/newtask'} style={style}>New Task</Link>
        </div>
        <div id='menu-bar-item'>
          <Link to={'/user'} style={style}>My Profile</Link>
        </div>
      </div>
    );
  }
}

module.exports = MenuBar;
