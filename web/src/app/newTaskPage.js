import React from 'react';
import {Link} from 'react-router-dom';
import history from './history';

import Autocomplete from 'react-autocomplete';
import './css/newtaskpage.css';

var samples = {
  "Sample tasks:": "no",
  "Clean Home": "Please clean my house. Address: 123 Database Street.",
  "Run Errands": "1. Take out the garbage.",
  "Babysit": "Be gentle with little Timmy.",
  "Moving Helper": "Help me move to my new address in Dhoby Ghaut.",
  "Assemble Furniture": "Got some beds from ikea. Handle with care. Thanks.",
  "Yard Work": "Trim shrubs to 2ft, mow front lawn, water the flowers."
};

class NewTaskPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      name: null
    };
    this.querySubmit = this.querySubmit.bind(this);
  }

  querySubmit(e) {
    e.preventDefault();
    var title = this.state.name;
    var desc = this.refs.desc.value;
    var acceptbid = this.refs.acceptbid.value;
    var startingbid = this.refs.startingbid.value;
    var starttime = this.refs.starttime.value;
    var accepttime = this.refs.accepttime.value;
    var endtime = this.refs.endtime.value;

    // use new task api
    var api_url = `http://localhost:3000/`+
    `createtask/${title}/${startingbid}/${endtime}?`;
    if ( accepttime ){
      api_url +=  `&accepttime=${accepttime}`;
    }
    if ( desc ){
      api_url += `&description=${desc}`;``
    }
    if ( starttime ){
      api_url += `&starttime=${starttime}`;
    }

    var data; 
    var that = this;
    fetch( api_url, { method: 'POST', credentials:'include'})
    .then(function(res) {
      if (res.ok) {
        alert('Task created!');
      } else {
        alert('You must complete all required fields');
      }
    });
  }

  renderTaskNameField() {
    return (
      <Autocomplete
        getItemValue={(item) => item}
        items={Object.keys(samples)}
        renderItem={(item, isHighlighted) =>
          <div id='dropdown-item' style={{ background: isHighlighted ? 'lightgrey' : 'white' }}>
            {item}
          </div>
        }
        value={this.state.name}
        isItemSelectable={(item) => samples[item] !== "no"}
        onChange={(e) => this.setState({name: e.target.value})}
        onSelect={(val) => this.setState({name: val})}/>
    );
  }

  render() {
    return(
      <div>
        <h3>New Task</h3>
        <div>
          <form id="query" onSubmit={this.querySubmit}>
            <div id="taskfieldname">Task Title (required)</div>
            <div id="taskfieldvalue"> 
              {this.renderTaskNameField()}
            </div>
            <div id="taskfieldname">Accept Bid</div>
            <div id="taskfieldvalue"> 
              <input type="number" min="0" ref="acceptbid"/>
            </div>
            <div id="taskfieldname">Starting Bid (required)</div>
            <div id="taskfieldvalue"> 
              <input type="number" min="0" ref="startingbid"/>
            </div>
            <div id="taskfieldname">Task Description</div>
            <div id="taskfieldvalue"> 
              <textarea maxLength="500" name="descbox" ref="desc" id="taskdesc" placeholder="Describe the task"></textarea>
            </div>
            <div id="taskfieldvalue"> 
              <div id="timefield">
                <div id="taskfieldname">Start Time</div>
                <input id="start" ref="starttime" type="datetime-local" />
              </div>
            </div>
            <div id="taskfieldvalue"> 
              <div id="timefield">
                <div id="taskfieldname">End Time (required)</div>
                <input id="end" ref = "endtime"type="datetime-local" />
              </div>
            </div>
            <div id="taskfieldvalue"> 
              <div id="timefield">
                <div id="taskfieldname">Finish bidding at:</div>
                <input id="accept" ref="accepttime" type="datetime-local" />
              </div>
            </div>
            <div id="submitbutton">
              <button id="submit" type="button" onClick={this.querySubmit}>Create New Task</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

module.exports = NewTaskPage;
