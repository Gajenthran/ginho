import React from 'react';
import PropTypes from 'prop-types';
import Navy from './../components/Navbar/Navbar';
import Footer from './../components/Footer/Footer';
import { parseQuery } from './../utils/utils';
import { Modal } from 'react-bootstrap';
import { searchOptions } from './../utils/options';

const passwordRegex = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&+_-]{8,}$/);

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.query = parseQuery(window.location.search)
    this.state = {
      popup: true,
      passwordShow: false,
      password: '',
      passwordError: '',
      passwordCheck: '',
      passwordCheckError: ''
    };

    this.fetchResetPassword = this.fetchResetPassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.togglePasswordShow = this.togglePasswordShow.bind(this);

  }

  togglePasswordShow() {
    this.setState({
      passwordShow: !this.state.passwordShow
    });
  }

  handleSubmit() {
    const valid = {
      password: passwordRegex.test(this.state.password),
      check: passwordRegex.test(this.state.passwordCheck),
      same: this.state.password === this.state.passwordCheck
    };

    if (valid.password && valid.check && valid.same) {
      const data = {
        email: this.query.email,
        token: this.query.t,
        password: this.state.password
      };
      this.fetchResetPassword('/api/user/resetPassword', data)
        .then(() => {
          this.props.history.push('/');
        })
        .catch(err => console.log(err));
    } else {
      if (!valid.same) {
        this.setState({
          passwordError: 'Veuillez entrer une adresse e-mail valide'
        });
      } else {
        this.setState({
          passwordError: 'Veuillez entrer un mot de passe valide (minimum 8 caractères contenant 1 majuscule, 1 miniscule et 1 chiffre)'
        });
      }
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    console.log(name);
    this.setState({ [name]: value });
    console.log(this.state.password);
  }

  async fetchResetPassword(url, data) {
    let response = await fetch(url, {
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

  async fetchTokenPassword(url, data) {
    let response = await fetch(url, {
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
    const data = {
      email: this.query.email,
      token: this.query.t
    };
    this.fetchTokenPassword('/api/user/checkTokenPassword', data)
      .then(res => {
        if (!res.exist)
          this.props.history.replace('/');
      })
      .catch(err => console.log(err));
  }


  colorTag(tag) {
    var color = "rgb(220, 220, 220)";
    if (searchOptions[tag.value]) {
      switch (searchOptions[tag.value].type) {
        case 'city':
          color = "rgb(56, 239, 242)";
          break;
        case 'language':
          color = "rgb(242, 79, 39)";
          break;
        default:
          break;
      }
    }
    tag.style = `--tag-bg: ${color}`;
  }

  handleClose() {
    this.setState({ popup: false });
  }

  render() {
    const { popup, passwordShow, passwordError } = this.state;
    return (
      <>
        <Modal
          show={popup}
          onHide={this.handleClose}
          dialogClassName="modal-50w"
          centered={true}
        >
          <Modal.Header className="reset--header" closeButton></Modal.Header>
          <Modal.Body className="reset--body">
            <h5> AMAZED</h5>
            <h6> C&apos;est reparti ! Créez votre nouveau mot de passe </h6>

            <span id="reset--password-field" className="reset--form">
              <div className="input-group">
                <input
                  className="form-control border-right-0"
                  onChange={this.handleChange}
                  type={passwordShow ? "text" : "password"}
                  placeholder="Mot de passe"
                  name="password"
                  required
                />
                <span className="input-group-append bg-white border-left-0">
                  <span onClick={this.togglePasswordShow} className="input-group-text bg-transparent">
                    <i className={passwordShow ? "far fa-eye-slash" : "far fa-eye"}></i>
                  </span>
                </span>
              </div>
              {passwordError.length > 0 && <p className="reset--error">{passwordError}</p>}
            </span>

            <span id="reset--password-check-field" className="reset--form">
              <div className="input-group">
                <input
                  onChange={this.handleChange}
                  name="passwordCheck"
                  className="form-control border-right-0"
                  type={passwordShow ? "text" : "password"}
                  placeholder="Confirmation du mot de passe"
                  required
                />
                <span className="input-group-append bg-white border-left-0">
                  <span onClick={this.togglePasswordShow} className="input-group-text bg-transparent">
                    <i className={passwordShow ? "far fa-eye-slash" : "far fa-eye"}></i>
                  </span>
                </span>
              </div>
            </span>
            <button className="reset--submit" onClick={this.handleSubmit}> TERMINÉ </button>
          </Modal.Body>
        </Modal>
        <Navy {...this.props} isSticky={false} />
        <div className="homepage">
          <div className="homepage-search">
          </div>
        </div>
        <Footer {...this.props} />
      </>
    );
  }
}

ResetPassword.defaultProps = {
  history: {}
};

ResetPassword.propTypes = {
  history: PropTypes.object,
};

export default ResetPassword;