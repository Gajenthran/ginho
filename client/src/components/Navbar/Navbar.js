import React from 'react';
import PropTypes from 'prop-types';
import auth from './../../utils/auth';
import { Navbar, Nav } from 'react-bootstrap';

class Navy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      redirect: '/user/profile',
      top: window.scrollY > 0 ? false : true,
      mailHover: false,
      favoritesHover: false
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.renderNavLinks = this.renderNavLinks.bind(this);
  }

  handleLogin() {
      window.open("http://localhost:3000/api/user/auth/google");
  }

  handleLogout() {
    auth.logout(() => {
      this.props.history.push('/');
    });
  }

  renderNavLinks() {
    return (
      auth.isLogin() ?
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Nav>
            <Nav.Link className="navbar--link" href={null}>
              <span /* onClick={this.handleDashboard} */ id="account-link">
                <i className="far fa-user-circle"></i>
                <span> {this.state.name.toUpperCase()} </span>
              </span>
            </Nav.Link >
          </Nav>
        </Navbar.Collapse>
        :
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Nav>
            <Nav.Link className="navbar--link" href={null}>
              <span onClick={this.handleLogin} id="account-link">
                <i className="far fa-user-circle"></i>
                <span> MON COMPTE </span>
              </span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
    );
  }

  render() {
    const shadow = this.state.top ?
      { boxShadow: "1px 4px 5px 1px rgba(0, 0, 0, 0.2)" } :
      {};
    return (
      <>
        <Navbar style={shadow} sticky="top" className="navbar">
          <Navbar.Brand href="/" className="navbar--logo-holder">
            <h1> DIAMANT </h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          {this.renderNavLinks()}
        </Navbar>
      </>
    );
  }
}

Navy.defaultProps = {
  history: {},
};

Navy.propTypes = {
  history: PropTypes.object,
};

export default Navy;
