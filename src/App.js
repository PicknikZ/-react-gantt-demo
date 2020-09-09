import React, { Component } from 'react';
import Gantt from './components/Gantt';
import Toolbar from './components/Toolbar';
import MessageArea from './components/MessageArea';
import './App.css';

const data = {
  data: [
    { id: 1, text: '压测1', start_date: '2020-02-12', duration: 3, progress: 1 },
    { id: 2, text: '压测2', start_date: '2020-02-16', duration: 3, progress: 0.4 , parent: 1},
    { id: 3, text: '压测3', start_date: '2020-02-19', duration: 5, progress: 0.4 , parent: 1},
    { id: 4, text: '压测4', start_date: '2020-03-16', duration: 5, progress: 0.4 },
    { id: 5, text: '压测5', start_date: '2020-05-22', duration: 1, progress: 0.4 },
    { id: 6, text: '压测6', start_date: '2020-06-13', duration: 10, progress: 0.4 },
    { id: 7, text: '压测7', start_date: '2020-01-16', duration: 4, progress: 0.4 },
    { id: 8, text: '压测8', start_date: '2020-04-16', duration: 6, progress: 0.4 },
  ],
  links: [
    { id: 1, source: 1, target: 2, type: '0' }
  ]
};
class App extends Component {
  state = {
    currentZoom: 'Days',
    messages: []
  };

  addMessage(message) {
    const maxLogLength = 5;
    const newMessate = { message };
    const messages = [
      newMessate,
      ...this.state.messages
    ];

    if (messages.length > maxLogLength) {
      messages.length = maxLogLength;
    }
    this.setState({ messages });
  }

  logDataUpdate = (type, action, item, id) => {
    let text = item && item.text ? ` (${item.text})` : '';
    let message = `${type} ${action}: ${id} ${text}`;
    if (type === 'link' && action !== 'delete') {
      message += ` ( source: ${item.source}, target: ${item.target} )`;
    }
    this.addMessage(message);
  }

  handleZoomChange = (zoom) => {
    this.setState({
      currentZoom: zoom
    });
  }

  render() {
    const { currentZoom, messages } = this.state;
    return (
      <div>
        <div className="zoom-bar">
          <Toolbar
            zoom={currentZoom}
            onZoomChange={this.handleZoomChange}
          />
        </div>
        <div className="gantt-container">
          <Gantt
            tasks={data}
            zoom={currentZoom}
            onDataUpdated={this.logDataUpdate}
          />
        </div>
        <MessageArea
          messages={messages}
        />
      </div>
    );
  }
}

export default App;

