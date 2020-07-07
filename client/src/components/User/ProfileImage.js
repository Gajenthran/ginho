import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


const noop = () => { };

const FileInput = ({ value, onChange = noop, ...rest }) => (
  <div>
    {Boolean(value.length) && (
      <div>Selected files: {value.map(f => f.name).join(", ")}</div>
    )}
    <label>
      Click to select some files...
      <input
        {...rest}
        style={{ display: "none" }}
        type="file"
        onChange={onChange}
      />
    </label>
  </div>
);

class ProfileImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popup: true,
      initialize: false,
      scale: 1.0,
      image: '',
      imageUrl: '',
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.handleSlider = this.handleSlider.bind(this);
    this.fetchUpdateProfile = this.fetchUpdateProfile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateProfileInputs = this.updateProfileInputs.bind(this);
    this.handleSaveImage = this.handleSaveImage.bind(this);
  }

  handleSaveImage() {
    const canvas = (this.editor).getImage().toDataURL();
    fetch(canvas)
      .then(res => res.blob())
      .then(blob => {
        const image = window.URL.createObjectURL(blob);
        this.fetchUpdateProfile(
          '/api/user/updateProfileImage',
          { image: canvas }
        );
        this.setState({ image });
        this.updateProfileInputs();
        this.handleClose();
      });
  }


  handleSlider(value) {
    console.log(value / 100 + 0.5);
    this.setState({ scale: value / 100 + 0.5 })
  }

  handleUploadFile(event) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ image: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  updateProfileInputs() {
    this.props.handleProfileInputs(
      this.state.image
    );
  }

  static getDerivedStateFromProps(props, prevState) {
    const { image } = props;
    if (
      prevState.initialize === false
    ) {
      return ({
        image: image,
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
  }

  updatePopupState() {
    this.props.handlePopupState(0);
  }

  handleClose() {
    this.updatePopupState();
    this.setState({ popup: false });
  }

  setEditorRef = (editor) => this.editor = editor;

  render() {
    const { popup, image } = this.state;
    return (
      <>
        <Modal
          show={popup}
          onHide={this.handleClose}
          dialogClassName="modal-60w"
          centered={true}
        >
          <Modal.Header className="profile-popup--title" closeButton>
            <h3> PHOTO DE PROFIL </h3>
          </Modal.Header>
          <Modal.Body className="profile-popup--container">
            <div className="profile-popup--image">
              <Dropzone
                onDrop={this.handleDrop}
                noClick
                noKeyboard
                style={{ width: '250px', height: '250px' }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <AvatarEditor
                      ref={this.setEditorRef}
                      width={250}
                      scale={this.state.scale} height={250}
                      image={this.state.image} />
                    <input {...getInputProps()} />
                  </div>
                )}
              </Dropzone>
              <div className="profile-popup--image-button">
                <Slider
                  defaultValue={50}
                  className="profile-popup--image-slider"
                  onChange={this.handleSlider}
                />
                <FileInput value={[]} onChange={this.handleUploadFile} />
                <button onClick={this.handleSaveImage}> ENREGISTRER LA PHOTO </button>
                <button> SUPPRIMER LA PHOTO </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}


ProfileImage.defaultProps = {
  history: {},
  handlePopupState: null,
  handleProfileInputs: null,
  bio: null,
  image: './../../assets/img/profile.png',
};

ProfileImage.propTypes = {
  history: PropTypes.object,
  handlePopupState: PropTypes.func,
  handleProfileInputs: PropTypes.func,
  bio: PropTypes.string,
  image: PropTypes.string,
};

export default ProfileImage;