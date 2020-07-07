import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

const bioTotalLength = 200;

class ProfileBio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popup: true,
      initialize: false,
      bio: '',
      bioLength: 0,
      bioError: false
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchUpdateProfile = this.fetchUpdateProfile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateProfileInputs = this.updateProfileInputs.bind(this);
  }

  updateProfileInputs() {
    this.props.handleProfileInputs(
      this.state.bio
    );
  }

  static getDerivedStateFromProps(props, prevState) {
    const { bio } = props;
    if (
      bio &&
      bio.length > 0 &&
      prevState.initialize === false
    ) {
      return ({
        bio: bio,
        bioLength: bio.length,
        initialize: true
      });
    }
    return null;
  }

  async fetchUpdateProfile(url, data) {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('login')}`
      },
      body: JSON.stringify({ data })
    });
    let res = await response.json();
    return res;
  }

  handleSubmit() {
    var { bioLength } = this.state;
    var bioError = bioTotalLength - bioLength < 0;

    if (!bioError) {
      this.updateProfileInputs();
      this.fetchUpdateProfile(
        '/api/user/updateProfileBio',
        { bio: this.state.bio }
      )
      this.handleClose();
    } else {
      this.setState({ bioError })
    }
  }

  updatePopupState() {
    this.props.handlePopupState(0);
  }

  handleClose() {
    this.updatePopupState();
    this.setState({ popup: false });
  }

  handleChange(event) {
    this.setState({
      bio: event.target.value,
      bioLength: event.target.value.length
    });
    console.log(this.state.bio);
  }

  render() {
    const { popup, bioLength, bioError, bio } = this.state;
    console.log(bioLength, bio);
    const remainingChar = bioTotalLength - bioLength;
    const fontColor = remainingChar < 0 ? { color: '#D13E82' } : null;
    const borderColor = bioError ? { border: '2px solid #D13E82' } : null;
    return (
      <>
        <Modal
          show={popup}
          onHide={this.handleClose}
          dialogClassName="modal-60w"
          centered={true}
        >
          <Modal.Header className="profile-popup--title" closeButton>
            <h3> PRÉSENTATION EN 200 CARACTÈRES </h3>
          </Modal.Header>
          <Modal.Body className="profile-popup--container profile-popup--bio">
            <div>
              <div className="profile-popup--bio-text">
                <textarea
                  onChange={this.handleChange}
                  placeholder="Présentez-vous brièvement et faites chavirer le coeur de tous les recruteurs !"
                  style={borderColor}
                  value={bio}
                >
                </textarea>
                <div className="profile-popup--text-length" style={fontColor}>
                  caractères restants: &nbsp;
                  {remainingChar}
                </div>
              </div>
              <div> <button onClick={this.handleSubmit}> ENREGISTRER </button> </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}


ProfileBio.defaultProps = {
  history: {},
  handlePopupState: null,
  handleProfileInputs: null,
  bio: null
};

ProfileBio.propTypes = {
  history: PropTypes.object,
  handlePopupState: PropTypes.func,
  handleProfileInputs: PropTypes.func,
  bio: PropTypes.string
};

export default ProfileBio;