import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './components/Home.jsx';
import Room from './components/Room.jsx';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Switch>
        <Route exact path="/room/:roomCode" component={Room} />
        <Route path="/" component={Home} />
      </Switch>
    );
  }
}

export default App;
