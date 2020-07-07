import React from 'react';
import PropTypes from 'prop-types';
import GoogleLogin from 'react-google-login';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import auth from './../../utils/auth';
// import './../../assets/css/ModalLogin.css'

const emailRegex = RegExp(/^(([^<>()[\]\\.,;:\s@"]+(.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const passwordRegex = RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: null,
      login: false,
      formErrors: {
        email: '',
        password: '',
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validForm = this.validForm.bind(this);
    this.fetchLogin = this.fetchLogin.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.responseLinkedIn = this.responseLinkedIn.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  validForm({ formErrors, ...fields }) {
    let valid = true;
    Object.values(formErrors).forEach(val => {
      val.length > 0 && (valid = false);
    });

    console.log(fields);

    Object.values(fields).forEach(val => {
      val === null && (valid = false);
    });

    return valid;
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    let formErrors = this.state.formErrors;

    switch (name) {
      case 'email':
        formErrors.email =
          emailRegex.test(value)
            ? ''
            : 'E-mail invalide';
        break;
      case 'password':
        formErrors.password =
          passwordRegex.test(value)
            ? ''
            : 'Mot de passe invalide';
        break;
      default:
        break;
    }

    this.setState({
      formErrors, [name]: value
    });
  }

  async fetchLogin(url, data) {
    console.log(data);
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

  handleSubmit(event) {
    event.preventDefault();
    if (this.validForm(this.state)) {
      const data = {
        email: this.state.email,
        password: this.state.password
      };
      this.fetchLogin('/api/user/login', data)
        .then(res => {
          if (!res.login) {
            this.setState({
              login: res.login
            });
            console.log('User not found.');
          } else {
            auth.login(res.token);
            this.props.nextStep(2);
          }
        })
        .catch(err => console.log(err.message));
    } else {
      console.log('User not found.');
    }
  }


  responseGoogle(response) {
    this.handleLogin(response, 'google');
  }

  responseLinkedIn(response) {
    this.handleLogin(response, 'linkedin');
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
        });
        console.log('Valid form.');
        this.props.nextStep(2);
      });
  }

  render() {
    const { formErrors } = this.state;
    return (
      <div className="form-container sign-in-container">

        <form onSubmit={this.handleSubmit}>
          <h1> Se connecter </h1>
          <p> Pas encore inscrit ? <button onClick={this.handleConnection}> Inscrivez-vous. </button></p>
          <GoogleLogin
            clientId="52119848987-1c08874mhrtffpdnfp7kb50tskhpbd1n.apps.googleusercontent.com"
            /* buttonText="" */
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
          <LinkedIn
            clientId="78vzvy6bbjjr4c"
            onFailure={this.responseLinkedIn}
            onSuccess={this.responseLinkedIn}
            redirectUri={`http://localhost:3000&scope=r_liteprofile`}
            renderElement={({ onClick, disabled }) => (
              <button onClick={onClick} disabled={disabled}> LinkedIn</button>
            )}
          />
          <div className="social-container">
            <span><a href="#!" className="social"><i className="fab fa-facebook-f"></i></a></span>
            <a href="#!" className="social"><i className="fab fa-google"></i></a>
            <a href="#!" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>ou</span>
          <input
            type="text"
            onChange={this.handleChange}
            placeholder="Email"
            name="email"
            className={formErrors.email.length > 0 ? 'error' : null}
            required
          />
          {formErrors.email.length > 0 && <p>{formErrors.email}</p>}
          <input
            onChange={this.handleChange}
            type="password"
            placeholder="Mot de passe"
            name="password"
            className={formErrors.password.length > 0 ? 'error' : null}
            required
          />
          {formErrors.password.length > 0 && <p>{formErrors.password}</p>}
          <a href="#!" onClick={this.handleResetPassword}>Mot de passe oublié ?</a>
          <button>Se connecter</button>
        </form>
      </div>
    );
  }
}

Login.defaultProps = {
  nextStep: null,
  history: {}
};

Login.propTypes = {
  nextStep: PropTypes.func,
  history: PropTypes.object
};

export default Login;