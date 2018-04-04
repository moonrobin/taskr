import React from 'react';
import {Link} from 'react-router-dom';
import history from './history';

import DetailItem from './detailItem.js';
import mockData from './mockdata/data2.js';

class TaskDisplayPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: mockData
    };
  }

  render() {
    var rows = [];
    rows.push();
    for (var key in mockData) {
      var row = <DetailItem attr={key} value={mockData[key]}/>;
      rows.push(row);
    }
    return(
      <div>
        <h3>Task Details</h3>
        {rows}
      </div>
    );
  }
}

module.exports = TaskDisplayPage;
