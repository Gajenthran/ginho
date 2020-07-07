import React from 'react';

import Lobby from './components/Lobby/Lobby';
import Join from './components/Join/Join';

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Join} />
      <Route path="/lobby" component={Lobby} />
    </Router>
  );
}

export default App;
