import React from 'react';
import PropTypes from 'prop-types';
import auth from './../../utils/auth';
import { Modal } from 'react-bootstrap';

const emailRegex = RegExp(/^(([^<>()[\]\\.,;:\s@"]+(.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const passwordRegex = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&+_-]{8,}$/);

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popup: true,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      exist: false,
      passwordShow: false,
      formErrors: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordState: 0
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validForm = this.validForm.bind(this);
    this.fetchSignUp = this.fetchSignUp.bind(this);
    this.handleConnection = this.handleConnection.bind(this);
    this.handleOauthGoogle = this.handleOauthGoogle.bind(this);
    this.fetchOauthGoogle = this.fetchOauthGoogle.bind(this);
    this.togglePasswordShow = this.togglePasswordShow.bind(this);
  }

  handleKeyDown(event) {
    if (event.key === 'Enter')
      this.handleSubmit();
  }

  togglePasswordShow() {
    this.setState({
      passwordShow: !this.state.passwordShow
    });
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
    console.log(this.state);
    this.setState({ [name]: value });
  }

  handleConnection() {
    this.props.updateConnection('login');
  }

  handleClose() {
    const formErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };

    this.setState({
      formErrors: formErrors,
      exist: false,
      popup: false
    });
    console.log(this.props);
    this.props.updateConnection(null);
  }

  async fetchSignUp(url, data) {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    });
    let res = await response.json();
    return res;
  }

  handleSubmit() {
    var { formErrors } = this.state, exist = false;

    for (let p in formErrors) {
      switch (p) {
        case 'firstName':
          formErrors[p] =
            this.state[p].length < 2
              ? '2 caractères minimum'
              : '';
          break;
        case 'lastName':
          formErrors[p] =
            this.state[p].length < 2
              ? '2 caractères minimum'
              : '';
          break;
        case 'email':
          formErrors[p] =
            emailRegex.test(this.state[p])
              ? ''
              : 'Veuillez entrer une adresse e-mail valide';
          break;
        case 'password':
          formErrors[p] =
            passwordRegex.test(this.state[p])
              ? ''
              : 'Veuillez entrer un mot de passe valide';
          break;
        default:
          break;
      }
    }

    var passwordState = 0;
    if (this.validForm(formErrors)) {
      const data = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
      };
      console.log("valid form -- signup")
      this.fetchSignUp('/api/user/signup', data)
        .then(res => this.signup(res, formErrors, exist));
    } else {
      if (formErrors.password.length > 0) {
        const { password } = this.state;
        if (password.length < 8) {
          passwordState = 1;
        } else if (/\d/.test(password)) {
          passwordState = 2;
        } else {
          passwordState = 3;
        }
      }
    }

    this.setState({
      formErrors: formErrors,
      exist: exist,
      passwordState: passwordState
    });
  }

  signup(res, formErrors, exist) {
    if (res.exist) {
      exist = res.exist;
      formErrors['email'] = 'Adresse e-mail existant.'
      console.log('Invalid form: exist.');
    } else {
      this.handleClose();
    }
    this.setState({
      formErrors: formErrors,
      exist: exist
    });
  }

  handleLogin(res, type) {
    console.log(res);
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
        console.log(res);
        break;
      default:
        break;
    }
    this.fetchSignUp('/api/user/signupOAuth', data)
      .then(res => {
        auth.login(res.token, () => {
          this.props.history.push('/user/profile');
        });
        this.handleClose();
        console.log('Valid form.');
      });
    console.log(data);
  }

  async fetchOauthGoogle(url) {
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    let res = await response.json();
    return res;
  }

  handleOauthGoogle() {
    console.log('handleOauth');
    window.open("https://amazed-277001.ew.r.appspot.com/api/user/auth/google");
  }

  render() {
    const { popup, passwordShow, passwordState, formErrors } = this.state;
    return (
      <>
        <Modal
          show={popup}
          onHide={this.handleClose}
          dialogClassName="modal-50w"
          centered={true}
        >
          <Modal.Header className="login--header" closeButton></Modal.Header>
          <Modal.Body className="signup--body">
            <h5> AMAZED</h5>
            <h6> INSCRIPTION </h6>

            <div className="login--social-container">
              <div id="login--google-div" onClick={this.handleOauthGoogle}>
                <img src={require('./../../assets/img/google.svg')} alt='google' ></img>
                <span> Inscription via Google</span>
              </div>
              <div id="login--linkedin-div">
                <i className="fab fa-linkedin-in"></i>
                <span > Inscription via LinkedIn</span>
              </div>
            </div>

            <span className="signup--form">
              <input
                type="text"
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                placeholder="Prénom"
                name="firstName"
                className={formErrors.firstName.length > 0 ? 'login--error' : null}
                style={formErrors.firstName.length > 0 ? { border: "2px solid #D13E82" } : null}
                required
              />
              {formErrors.firstName.length > 0 && <p className="login--error">{formErrors.firstName}</p>}
            </span>
            <span className="signup--form">
              <input
                type="text"
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                placeholder="Nom"
                name="lastName"
                className={formErrors.lastName.length > 0 ? 'error' : null}
                style={formErrors.lastName.length > 0 ? { border: "2px solid #D13E82" } : null}
                required
              />
              {formErrors.lastName.length > 0 && <p className="login--error">{formErrors.lastName}</p>}
            </span>
            <span className="signup--form">
              <input
                type="text"
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                placeholder="Email"
                name="email"
                className={formErrors.email.length > 0 || this.state.exist ? 'error' : null}
                style={formErrors.email.length > 0 ? { border: "2px solid #D13E82" } : null}
                required
              />
              {formErrors.email.length > 0 && <p className="login--error">{formErrors.email}</p>}
            </span>
            <span
              id="password-field"
              className="signup--form"
              style={formErrors.password.length > 0 ? { "marginBottom": '0px' } : null}
            >
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
            <ul className="signup--password-test" style={{ "marginTop": "10px" }} >
              <li style={{ color: passwordState === 1 ? "#D13E82" : null }}> &gt; 8 caractères </li>
              <li style={{ color: passwordState === 2 ? "#D13E82" : null }}> 1 majuscule / 1 minuscule </li>
              <li style={{ color: passwordState === 3 ? "#D13E82" : null }}> 1 chiffre </li>
            </ul>
            <p className="signup--condition"> En créant un compte, j&apos;accepte les <span> conditions générales d&apos;utilisation </span> d&apos;AMAZED.</p>
            <div className="signup--create">
              <button onClick={this.handleSubmit}> CRÉER UN COMPTE </button>
            </div>
            <p className="signup--connected"> Déjà inscrit ? <span onClick={this.handleConnection}> Se connecter </span> </p>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

Signup.defaultProps = {
  updateConnection: null,
  history: {}
};

Signup.propTypes = {
  updateConnection: PropTypes.func,
  history: PropTypes.object
};

export default Signup;