import React from 'react';
import PropTypes from 'prop-types';
import auth from './../../utils/auth';
import { Modal } from 'react-bootstrap';

const emailRegex = RegExp(/^(([^<>()[\]\\.,;:\s@"]+(.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const passwordRegex = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&+_-]{8,}$/);

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popup: true,
      email: null,
      password: null,
      login: false,
      passwordShow: false,
      formErrors: {
        email: '',
        password: '',
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validForm = this.validForm.bind(this);
    this.fetchLogin = this.fetchLogin.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleConnection = this.handleConnection.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.togglePasswordShow = this.togglePasswordShow.bind(this);
    this.handleOauthGoogle = this.handleOauthGoogle.bind(this);
    this.handleOauthLinkedIn = this.handleOauthLinkedIn.bind(this);
  }

  handleKeyDown(event) {
    if (event.key === 'Enter')
      this.handleSubmit();
  }

  handleConnection() {
    this.props.updateConnection('signup');
  }

  handleResetPassword() {
    this.props.updateConnection('reset');
  }

  validForm(formErrors) {
    let valid = true;
    Object.values(formErrors).forEach(val => {
      val.length > 0 && (valid = false);
    });
    return valid;
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  async fetchLogin(url, data) {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: data })
    });
    let res = await response.json();
    return res;
  }

  handleSubmit() {
    var { formErrors } = this.state;

    for (let p in formErrors) {
      switch (p) {
        case 'email':
          formErrors[p] =
            emailRegex.test(this.state[p])
              ? ''
              : 'Veuillez entrer une adresse e-mail valide.';
          break;
        case 'password':
          formErrors[p] =
            passwordRegex.test(this.state[p])
              ? ''
              : 'Veuillez entrer un mot de passe valide.';
          break;
        default:
          break;
      }
    }

    if (this.validForm(formErrors)) {
      console.log('Valid Form.')
      console.log(this.validForm(formErrors))
      const data = {
        email: this.state.email,
        password: this.state.password
      };
      this.fetchLogin('/api/user/login', data)
        .then(res => {
          console.log(res);
          if (!res.login) {
            this.setState({
              login: res.login
            });
            formErrors['email'] = 'Veuillez entrer une adresse e-mail valide.'
            this.setState({ formErrors });
            console.log('User not found.');
          } else {
            this.handleClose();
            auth.login(res.token, () => {
              this.props.history.push('/user/profile');
            });
            console.log('User found.');
          }
        })
        .catch(err => console.log(err.message));
    } else {
      this.setState({ formErrors });
      console.log('User not found.');
    }
  }

  handleLogin(res, type) {
    var data = null;
    switch (type) {
      case 'google':
        var [firstName, lastName] = res.profileObj.name.split(' ');
        data = {
          email: res.profileObj.email,
          firstName: firstName,
          lastName: lastName,
          password: null,
          imageUrl: res.profileObj.imageUrl,
          type: 'google'
        };
        break;
      case 'facebook':
        break;
      case 'linkedin':
        break;
      default:
        break;
    }
    this.fetchLogin('/api/user/signupOAuth', data)
      .then(res => {
        auth.login(res.token, () => {
          this.props.history.push('/user/profile');
        });
        this.handleClose();
        console.log('Valid form.');
      });
  }

  togglePasswordShow() {
    this.setState({
      passwordShow: !this.state.passwordShow
    });
  }

  handleClose() {
    const formErrors = {
      email: '',
      password: ''
    };

    this.setState({
      formErrors: formErrors,
      login: true,
      popup: false
    });
    this.props.updateConnection('quit');
  }

  handleOauthGoogle() {
    window.open("https://amazed-277001.ew.r.appspot.com/api/user/auth/google");
  }

  handleOauthLinkedIn() {
    window.open("https://amazed-277001.ew.r.appspot.com/api/user/auth/linkedin");
  }

  render() {
    const { popup, formErrors, passwordShow } = this.state;
    return (
      <>
        <Modal
          show={popup}
          onHide={this.handleClose}
          dialogClassName="modal-50w"
          centered={true}
        >
          <Modal.Header className="login--header" closeButton></Modal.Header>
          <Modal.Body className="login--body">
            <h5> AMAZED</h5>
            <h6> CONNEXION </h6>
            <div className="login--social-container">
              <div id="login--google-div" onClick={this.handleOauthGoogle}>
                <img src={require('./../../assets/img/google.svg')} alt='google' ></img>
                <span> Connexion via Google</span>
              </div>
              <div id="login--linkedin-div" onClick={this.handleOauthLinkedIn}>
                <i className="fab fa-linkedin-in"></i>
                <span > Connexion via LinkedIn</span>
              </div>
            </div>

            <span id="email-field" className="login--form">
              <input
                type="text"
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                placeholder="Adresse e-mail"
                name="email"
                className={formErrors.email.length > 0 ? 'login--error' : null}
                style={formErrors.email.length > 0 ? { border: "2px solid #D13E82" } : null}
                required
              />
              {formErrors.email.length > 0 && <p className="login--error">{formErrors.email}</p>}
            </span>
            <span id="login--password-field" className="login--form">
              <div className="input-group">
                <input
                  className="form-control border-right-0"
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  type={passwordShow ? "text" : "password"}
                  placeholder="Mot de passe"
                  name="password"
                  style={formErrors.password.length > 0 ? { border: "2px solid #D13E82" } : null}
                />
                <span
                  className="input-group-append bg-white border-left-0"
                  style={formErrors.password.length > 0 ? { border: "2px solid #D13E82" } : null}
                >
                  <span onClick={this.togglePasswordShow} className="input-group-text bg-transparent">
                    <i className={passwordShow ? "far fa-eye-slash" : "far fa-eye"}></i>
                  </span>
                </span>
              </div>
              {formErrors.password.length > 0 && <p className="login--error">{formErrors.password}</p>}
            </span>
            <p id="login--forgot" onClick={this.handleResetPassword} >Mot de passe oublié ?</p>
            <button className="login--submit" onClick={this.handleSubmit}> CONNEXION </button>
            <div className="login--create">
              <p > NOUVEAU CHEZ AMAZED ? </p>
              <button onClick={this.handleConnection}> CRÉER UN COMPTE </button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

Login.defaultProps = {
  updateConnection: null,
  history: {}
};

Login.propTypes = {
  updateConnection: PropTypes.func,
  history: PropTypes.object
};

export default Login;