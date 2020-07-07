import React from 'react';
import PropTypes from 'prop-types';
import Login from './Login';
import Signup from './Signup';
import Password from './ResetPassword';
import auth from './../../utils/auth';

class Navy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSticky: this.props.isSticky,
      sticky: this.props.isSticky,
      color: this.props.isSticky ? 'blue' : 'white',
      name: '',
      redirect: '/user/profile'
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleDashboard = this.handleDashboard.bind(this);
    this.handleFavorites = this.handleFavorites.bind(this);
    this.renderConnectionPopup = this.renderConnectionPopup.bind(this);
    this.updateConnection = this.updateConnection.bind(this);
    this.renderNav = this.renderNav.bind(this);
    this.fetchGetProfile = this.fetchGetProfile.bind(this);
  }

  handleScroll() {
    const sticky = this.state.sticky ?
      true :
      window.scrollY > 0 ?
        true : false;
    this.setState({
      isSticky: sticky,
      color: sticky ? 'black' : 'white'
    });
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.fetchGetProfile(
      '/api/user/getProfileName'
    )
      .then(res => this.getProfile(res));

  }

  getProfile({ status, activated, name }) {
    if (status !== 200)
      return;
    this.setState({
      redirect: activated ?
        '/user/profile' : '/user/createprofile'
    });
    this.setState({ name });
  }

  async fetchGetProfile(url) {
    let response = await fetch(url, {
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

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }


  handleLogin() {
    this.setState({ connection: 'login' });
  }

  handleLogout() {
    auth.logout(() => {
      this.props.history.push('/');
    });
  }

  handleFavorites() {
    this.props.history.push('/user/favorites');
  }

  handleDashboard() {
    this.props.history.push(this.state.redirect);
  }

  handleSignUp() {
    this.setState({ connection: 'signup' });
  }

  updateConnection(connection) {
    this.setState({
      connection: connection
    });
    if (this.props.updateLogin !== null)
      this.props.updateLogin('');
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.connection === 'login') {
      return { connection: nextProps.connection };
    }
    return null;
  }

  renderConnectionPopup() {
    switch (this.state.connection) {
      case 'login':
        return <Login {...this.props} updateConnection={this.updateConnection} />;
      case 'signup':
        return <Signup {...this.props} updateConnection={this.updateConnection} />;
      case 'reset':
        return <Password {...this.props} updateConnection={this.updateConnection} />
      case 'quit':
        return null;
      default:
        break;
    }
  }

  renderNav() {
    const { isSticky } = this.state;
    console.log(isSticky);
    const bgColor = isSticky === true ?
      'linear-gradient(0deg, #0B2BB1 0%, #1206A0 100%)' :
      'black';
    const color = isSticky ?
      '#1206A0' : 'white';
    return auth.isLogin() ?
      <ul className="navbar--link">
        <li
          id="account-link-item"
          className="navbar--link-item"
          onClick={this.handleDashboard}
        >
          <span id="account-link"
            style={{ 'backgroundColor': bgColor, 'background': bgColor, 'color': color }}>
            <span>  {this.state.name} </span>
          </span>

        </li>
        <li
          className="navbar--link-item"
          id="dropdown-menu"
        >
          <i className="fas fa-bars" style={{ color: color }}></i>
        </li>
      </ul> 
      :
      <ul className="navbar--link">
        <li
          id="account-link-item"
          className="navbar--link-item"
          onClick={this.handleLogin}
        >
          <span id="account-link"
            style={{ 'backgroundColor': bgColor, 'background': bgColor, 'color': color }}>
            <i className="far fa-user-circle"></i>
            <span>  MON COMPTE </span>
          </span>

        </li>
        <li
          className="navbar--link-item"
          id="dropdown-menu"
        >
          <i className="fas fa-bars" style={{ color: color }}></i>
        </li>
      </ul>
  }

  render() {
    return (
      <main>
        <nav className={this.state.isSticky ? "navbar navbar-sticky" : "navbar"}>
          <div className="navbar--logo-holder">
            <h1 style={{ borderColor: this.state.color }}>
              <a style={{ color: this.state.color }} href="/"> AMAZED </a>
            </h1>
          </div>

          {this.renderNav()}
          {this.renderConnectionPopup()}
        </nav>
      </main>
    );
  }
}

Navy.defaultProps = {
  history: {},
  isSticky: true,
  connection: '',
  updateLogin: null
};

Navy.propTypes = {
  history: PropTypes.object,
  isSticky: PropTypes.bool,
  connection: PropTypes.string,
  updateLogin: PropTypes.func
};

export default Navy;
