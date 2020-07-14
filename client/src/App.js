import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from './components/Home/Home';
import Ginho from './components/Ginho/Ginho';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/index.css';

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/game" component={Ginho} />
    </Router>
  );
}

export default App;
