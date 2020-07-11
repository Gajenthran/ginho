import React from 'react';

import Diamant from './components/Lobby/Lobby';
import Join from './components/Join/Join';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/index.css';

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Join} />
      <Route path="/diamant" component={Diamant} />
    </Router>
  );
}

export default App;
