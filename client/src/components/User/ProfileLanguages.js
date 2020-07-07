import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';

const maxLanguages = 6;

class ProfileLanguages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialize: false,
      languages: {},
      popup: true,
      expHover: false,
      languagesOpt: [
        { value: 'Maternel', label: 'Maternel' },
        { value: 'Bilingue', label: 'Bilingue' },
        { value: 'Courant', label: 'Courant' },
        { value: 'Intermédiaire', label: 'Intermédiaire' },
        { value: 'Notions', label: 'Notions' }
      ]
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleExpHover = this.handleExpHover.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.renderLanguages = this.renderLanguages.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleRemoveLanguage = this.handleRemoveLanguage.bind(this);
    this.handleAddLanguage = this.handleAddLanguage.bind(this);
    this.updateProfileInputs = this.updateProfileInputs.bind(this);
  }

  static getDerivedStateFromProps(props, prevState) {
    const { profileLanguages } = props;
    if (
      profileLanguages &&
      prevState.initialize === false
    ) {
      var languages = {};
      for (let l = 0; l < profileLanguages['languages'].length; l++) {
        languages[l] = {
          value: profileLanguages['languages'][l],
          label: profileLanguages['levels'][l],
          error: false
        }
      }
      return ({
        languages: languages,
        initialize: true
      });
    }
    return null;
  }

  updatePopupState() {
    this.props.handlePopupState(0);
  }

  handleClose() {
    this.updatePopupState();
    this.setState({ popup: false });
  }

  handleExpHover(event) {
    this.setState({
      expHover:
        event.nativeEvent.type === 'mouseover' ?
          true : false
    });
  }

  handleSelectChange(selectedOption, action) {
    var { languages } = this.state;
    languages[action['name']] = {
      value: languages[action['name']].value,
      label: selectedOption['label'],
      error: false
    };
    this.setState({ languages })
  }

  handleRemoveLanguage(event) {
    var { languages } = this.state;
    delete languages[event.target.id]
    this.setState({ languages });
  }

  handleTextChange(event) {
    var { languages } = this.state;
    languages[event.target.name]['value'] = event.target.value;
    languages[event.target.name]['error'] = false;
    this.setState({ languages });
  }

  handleAddLanguage() {
    var { languages } = this.state;
    const keys = Object.keys(languages),
      id = keys[keys.length - 1] + 1;
    languages[id] = ({ value: "", label: "", error: false });
    this.setState({ languages });
  }


  renderLanguages() {
    const { languages, languagesOpt } = this.state;
    const borderColor = { border: '2px solid #D13E82' };
    return (
      Object.keys(languages).map(l =>
        <div key={l} className="profile-popup--languages-list-input">
          <input
            type="text"
            placeholder="Langue"
            name={l}
            value={languages[l].value}
            style={languages[l].error === true ? borderColor : null}
            onChange={this.handleTextChange}
          />
          <Select
            name={l}
            className={
              languages[l].error === true ?
                "profile-popup--languages-list-select profile-popup--languages-list-select-error"
                : "profile-popup--languages-list-select"
            }
            defaultValue={languages[l]}
            onChange={this.handleSelectChange}
            options={languagesOpt}
            placeholder="Niveau"
            style={languages[l].error === true ? borderColor : null}
          />
          <i
            className="fas fa-times"
            id={l}
            onClick={this.handleRemoveLanguage}>
          </i>
        </div>
      )
    );
  }

  renderAddLanguages() {
    const { expHover, languages } = this.state;
    const nbLanguages = Object.keys(languages).length;
    const nbButtons = Math.max(maxLanguages - nbLanguages, 0);

    var validButton = null,
      notAllowedButtons = [];

    if (nbButtons !== 0)
      validButton = (
        <>
          <div
            className={expHover ? "profile-popup--languages-list-add-hover" : "profile-popup--languages-list-add"}
            onMouseOver={this.handleExpHover}
            onMouseLeave={this.handleExpHover}
            onClick={this.handleAddLanguage}
          >
            <i className="fas fa-plus"></i>
            <span> AJOUTER UNE EXPÉRIENCE </span>
          </div>
        </>
      )

    for (let i = 0; i < nbButtons - 1; i++) {
      notAllowedButtons[i] = (
        <div
          key={i}
          className="profile-popup--languages-list-add-blocked"
        >
          <i className="fas fa-plus"></i>
          <span> AJOUTER UNE EXPÉRIENCE </span>
        </div>
      )
    }

    return (
      <>
        {validButton}
        {notAllowedButtons}
      </>
    );
  }

  updateProfileInputs(languages, levels) {
    console.log(levels, languages);
    this.props.handleProfileInputs(
      {
        languages: languages,
        levels: levels
      }
    );
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
    var { languages } = this.state;
    var popup = false;
    for (let index in languages) {
      if (languages[index].label === "" || languages[index].value === "") {
        languages[index].error = true;
        popup = true;
        break;
      }
    }

    if (!popup) {
      var languagesList = [], levelsList = [];
      Object.keys(languages).forEach(l => {
        languagesList.push(languages[l].value);
        levelsList.push(languages[l].label);
      });
      this.fetchUpdateProfile(
        '/api/user/updateProfileLanguages',
        { languages: languagesList, levels: levelsList }
      )
      this.updateProfileInputs(languagesList, levelsList);
      this.handleClose();
    } else {
      this.setState({ languages })
    }
  }

  render() {
    const { popup } = this.state;
    return (
      <>
        <Modal
          show={popup}
          onHide={this.handleClose}
          dialogClassName="modal-60w"
          centered={true}
        >
          <Modal.Header className="profile-popup--title" closeButton>
            <h3> AJOUTER VOS COMPÉTENCES LINGUISTIQUES </h3>
          </Modal.Header>
          <Modal.Body className="profile-popup--container profile-popup--languages">
            <div> <p> Vous maîtrisez une ou plusieurs langues ? Faites-le savoir aux recruteurs autour de vous !</p> </div>
            <div className="profile-popup--languages-group">
              <div> <h3> LANGUES <i> (6 maximum): </i> </h3></div>
              <div className="profile-popup--languages-list">
                {this.renderLanguages()}
                {this.renderAddLanguages()}
              </div>
            </div>
            <div> <button onClick={this.handleSubmit}> ENREGISTRER </button> </div>

          </Modal.Body>
        </Modal>
      </>
    );
  }
}


ProfileLanguages.defaultProps = {
  history: {},
  handlePopupState: null,
  handleProfileInputs: null,
  profileLanguages: {}
};

ProfileLanguages.propTypes = {
  history: PropTypes.object,
  handlePopupState: PropTypes.func,
  handleProfileInputs: PropTypes.func,
  profileLanguages: PropTypes.object
};

export default ProfileLanguages;