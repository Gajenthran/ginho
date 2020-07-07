import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

const emailRegex = RegExp(/^(([^<>()[\]\\.,;:\s@"]+(.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popup: true,
      email: '',
      emailError: '',
      submited: false
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleConnection = this.handleConnection.bind(this);
    this.fetchResetPasswordMail = this.fetchResetPasswordMail.bind(this);
  }

  handleConnection() {
    this.props.updateConnection('login');
  }

  handleChange(event) {
    this.setState({ email: event.target.value })
  }

  handleClose() {
    this.setState({
      email: '',
      emailError: ''
    });
    this.props.updateConnection(null);
  }

  async fetchResetPasswordMail(url, email) {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email })
    });
    let res = await response.json();
    return res;
  }

  handleSubmit(event) {
    event.preventDefault();
    var emailError =
      emailRegex.test(this.state.email)
        ? ''
        : 'E-mail invalide';

    this.setState({ emailError: emailError, submited: true })
    if (emailError.length <= 0) {
      this.fetchResetPasswordMail('/api/user/resetPasswordMail', this.state.email)
        .then(res => console.log(res.message))
        .catch(err => console.log(err.message));
    }
  }

  render() {
    const { popup, emailError, submited } = this.state;
    return (
      <>
        {emailError.length <= 0 && submited === true ?
          <Modal
            show={popup}
            onHide={this.handleClose}
            dialogClassName="modal-50w"
            centered={true}
          >
            <Modal.Header className="login--header" closeButton></Modal.Header>
            <Modal.Body className="login--body">
              <h5> AMAZED</h5>
              <h6> Mot de passe oublié </h6>
              <p className="reset--text"> Entrez l’adresse e-mail associée à votre compte AMAZED pour réinitialiser votre mot de passe. </p>
              <button className="login--submit" onClick={this.handleConnection}> REVENIR SUR LA CONNEXION </button>
            </Modal.Body>
          </Modal>
          :
          <Modal
            show={popup}
            onHide={this.handleClose}
            dialogClassName="modal-50w"
            centered={true}
          >
            <Modal.Header className="login--header" closeButton></Modal.Header>
            <Modal.Body className="login--body">
              <h5> AMAZED</h5>
              <h6> Mot de passe oublié </h6>
              <p className="reset--text"> Entrez l’adresse e-mail associée à votre compte AMAZED pour réinitialiser votre mot de passe. </p>

              <span id="email-field" className="login--form">
                <input
                  type="text"
                  onChange={this.handleChange}
                  placeholder="Adresse e-mail"
                  name="email"
                  className={emailError.length > 0 ? 'login--error' : null}
                  required
                />
                {emailError.length > 0 && <p className="login--error">{emailError}</p>}
              </span>
              <button className="login--submit" onClick={this.handleSubmit}> CONTINUER </button>
            </Modal.Body>
          </Modal>
        }
      </>
    );
  }
}

ResetPassword.defaultProps = {
  updateConnection: null,
  history: {}
};

ResetPassword.propTypes = {
  updateConnection: PropTypes.func,
  history: PropTypes.object
};

export default ResetPassword;