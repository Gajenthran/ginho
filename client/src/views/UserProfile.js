import React from 'react';
import PropTypes from 'prop-types';
import Navy from './../components/Navbar/Navbar';
import Footer from './../components/Footer/Footer';
import Profile from './../components/User/Profile';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: null
    }

    this._isMounted = false;
    this.fetchGetProfile = this.fetchGetProfile.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  async fetchGetProfile() {
    let response = await fetch('/api/user/getProfile', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('login')}`
      }
    });
    let data = await response.json();
    return data;
  }

  getProfile(res) {
    console.log(res);
    if (res.status === 200 && this._isMounted)
      this.setState({ profile: res['profile'] });
  }

  componentDidMount() {
    this._isMounted = true;
    window.scrollTo(0, 0);
    this.fetchGetProfile()
      .then(res => this.getProfile(res))
      .catch(err => console.log(err.message));
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <>
        <Navy {...this.props} />
        <Profile {...this.props} profile={this.state.profile} />
        <Footer {...this.props} />
      </>
    );
  }
}

UserProfile.defaultProps = {
  history: {}
};

UserProfile.propTypes = {
  history: PropTypes.object,
};
export default UserProfile;