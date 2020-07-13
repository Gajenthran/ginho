import React from 'react';

import Home from './components/Home/Home';
import Ginho from './components/Ginho/Ginho';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/index.css';

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/ginho" component={Ginho} />
    </Router>
  );
}

export default App;
