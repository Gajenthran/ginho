import React from 'react';
import PropTypes from 'prop-types';
import auth from '../utils/auth';
import { parseQuery } from './../utils/utils';

class ConfirmSignup extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.fetchOauthLogin = this.fetchOauthLogin.bind(this);
  }

  async fetchOauthLogin() {
    let response = await fetch('/api/user/auth/google/redirect', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    let res = await response.json();
    return res;
  }

  componentDidMount() {
    this._isMounted = true;
    const { token } = parseQuery(window.location.search);
    console.log(token);
    if (token) {
      if (!auth.isLogin()) {
        auth.login(token, () => {
          this.props.history.replace('/user/profile');
        });
      } else {
        this.props.history.replace('/');
      }
    } else {
      this.props.history.replace('/');
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <>
      </>
    );
  }
}

ConfirmSignup.defaultProps = {
  history: {}
};

ConfirmSignup.propTypes = {
  history: PropTypes.object,
};

export default ConfirmSignup;