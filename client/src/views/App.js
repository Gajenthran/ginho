import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ProtectedRoute } from './../components/ProtectedRoute';
import routes from './../routes.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.getRoutes = this.getRoutes.bind(this);
  }

  getRoutes(routes) {
    return routes.map((prop, key) => {
      if (prop.protected === true) {
        return (
          <ProtectedRoute
            exact={prop.exact}
            path={prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return (
          <Route
            exact={prop.exact}
            path={prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
    });
  }

  render() {
    return (
      <>
        <BrowserRouter>
          <Switch>
            {this.getRoutes(routes)}
            <Route path="*" component={() => "404 NOT FOUND"} />
          </Switch>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
