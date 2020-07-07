import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from 'prop-types';
import auth from "./../utils/auth";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (
        auth.isLogin() ?
          <Component {...props} />
          : <Redirect to={{
            pathname: "/",
            state: {
              from: props.location
            }
          }}/>
      )}
    />
  );
};

ProtectedRoute.defaultProps = {
  component: null,
  location: null,
};

ProtectedRoute.propTypes = {
  location: PropTypes.object,
  component: PropTypes.any
};