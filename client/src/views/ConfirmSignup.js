import React from 'react';
import PropTypes from 'prop-types';
import auth from '../utils/auth';
import { parseQuery } from './../utils/utils';

class ConfirmSignup extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.query = parseQuery(window.location.search)
    this.fetchConfirm = this.fetchConfirm.bind(this);
  }

  async fetchConfirm() {
    const data = {
      email: this.query.u,
      password: this.query.p,
      firstName: this.query.fn,
      lastName: this.query.ln,
      token: this.query.t
    };
    let response = await fetch('/api/user/confirmSignup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data })
    });
    let res = await response.json();
    return res;
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchConfirm()
      .then(user => {
        if (user.login === true) {
          auth.login(user.token, () => {
            this.props.history.replace('/user/profile');
          });
        } else {
          this.props.history.replace('/');
        }
      })
      .catch(err => console.log(err.message));
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