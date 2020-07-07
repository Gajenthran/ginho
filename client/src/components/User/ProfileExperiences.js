import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


const jobOptions = [
  { value: "Temps plein", label: "Temps plein" },
  { value: "Temps partiel", label: "Temps partiel" },
  { value: "Entrepreneur", label: "Entrepreneur" },
  { value: "Auto-entrepreneur", label: "Auto-entrepreneur" },
  { value: "Freelance", label: "Freelance" },
  { value: "CDD", label: "CDD" },
  { value: "Stage", label: "Stage" },
  { value: "Contrat en alternance", label: "Contrat en alternance" }
];

const MONTH_CONV = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

class profileExp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialize: false,
      experiences: [],
      currentProfileExp: [],
      popup: true,
      title: '',
      expContract: {},
      enterprise: '',
      loc: '',
      startExp: '',
      endExp: '',
      description: '',
      currentExp: false,
      endingCurrentExp: true,
      valids: {
        title: true,
        enterprise: true,
        loc: true,
        expContract: true,
        startExp: true,
        endExp: true
      }
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.updateProfileInputs = this.updateProfileInputs.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.renderCurrentExp = this.renderCurrentExp.bind(this);
  }

  renderCurrentExp() {
    if (!this.state.currentExp)
      return null;
    return (
      this.state.currentProfileExp.length > 0 ?
        <>
          <p>
            Vous avez encore
            <span>
              {" " + this.state.currentProfileExp.length}
              {
                this.state.currentProfileExp.length < 2 ?
                  " autre poste actuel. " :
                  " autres postes actuels. "
              }
            </span>
            Souhaitez-vous y mettre fin ?
          </p>
          {this.state.currentProfileExp.map((expId, i) => {
            console.log(this.state.experiences[expId].currentExp);
            return (
              <span key={i} className="profile-popup--exp-jobEnd">
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name={expId + i}
                    id={expId + i}
                    onChange={(e) => this.handleCheckboxChange(e, expId)}
                    checked={!this.state.experiences[expId].currentExp}
                  />
                  <label className="checkbox-label" htmlFor={expId + i}> Mettre fin à ce poste </label>
                </div>
                <p> {this.state.experiences[expId].title} chez {this.state.experiences[expId].enterprise} </p>
                <p> {MONTH_CONV[this.state.experiences[expId].startExp.getMonth()]} {this.state.experiences[expId].startExp.getFullYear()}  - Aujourd&apos;hui </p>
              </span>
            );
          })}
        </>
        :
        null
    );
  }

  static getDerivedStateFromProps(props, prevState) {
    const { profileExperiences } = props;
    console.log(profileExperiences);
    if (
      profileExperiences &&
      prevState.initialize === false
    ) {
      let currentProfileExp = [];
      for (let i = 0; i < profileExperiences.length; i++)
        if (profileExperiences[i].currentExp === true)
          currentProfileExp.push(i);
      return ({
        experiences: profileExperiences,
        currentProfileExp: currentProfileExp,
        initialize: true
      });
    }
    return null;
  }

  handleDateChange(date, name, value) {
    console.log(date, name, value)
    this.setState({ [name]: date });
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

  validForm() {
    const { valids } = this.state;
    var valid = true;
    for (let key in valids) {
      switch (key) {
        case 'title':
        case 'enterprise':
        case 'loc':
          valids[key] = this.state[key].length > 0;
          break;
        case 'startExp':
          valids[key] =
            Object.prototype.toString.call(this.state[key]) === '[object Date]';
          break;
        case 'endExp':
          valids[key] = this.state.currentExp ?
            true :
            Object.prototype.toString.call(this.state[key]) === '[object Date]' &&
            (this.state['startExp'] < this.state[key]);
          break;
        case 'expContract':
          valids[key] =
            Object.prototype.hasOwnProperty.call(this.state[key], 'label') &&
            this.state[key]['label'].length > 0;
          break;
        default:
          break;
      }
      if (!valids[key]) { valid = false; break; }
    }
    this.setState({ valids });
    return valid;
  }

  handleSubmit() {
    if (this.validForm()) {
      // checking regexp

      var { experiences } = this.state;
      var currentProfileExp = [];
      for (let expId of this.state.currentProfileExp)
        if (!experiences[expId].currentExp) {
          experiences[expId].endExp = new Date();
          currentProfileExp.push(expId);
        }

      const newExperiences = {
        title: this.state.title,
        startExp: this.state.startExp,
        endExp: this.state.currentExp ? null : this.state.endExp,
        expContract: this.state.expContract.value,
        enterprise: this.state.enterprise,
        loc: this.state.loc,
        description: this.state.description,
        currentExp: this.state.currentExp,
        endingCurrentExp: this.state.endingCurrentExp,
      };

      this.updateProfileInputs(newExperiences);

      this.fetchUpdateProfile(
        '/api/user/updateProfileExperiences',
        {
          newExperience: newExperiences,
          experiences: {
            experiencesList: experiences,
            currentProfileExp: currentProfileExp
          }
        }
      );
      this.handleClose();
    }
  }

  updateProfileInputs(profileExperiences) {
    var { experiences } = this.state;
    experiences.push(profileExperiences);
    this.props.handleProfileInputs(experiences);
  }

  updatePopupState() {
    this.props.handlePopupState(0);
  }

  handleClose() {
    this.updatePopupState();
    this.setState({ popup: false });
  }

  handleSelectChange(selectedOption, action) {
    this.setState({ [action.name]: selectedOption })
  }

  handleTextChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
    console.log(this.state[event.target.name]);
  }

  handleCheckboxChange(event, expId) {
    if (expId) {
      var { experiences } = this.state;
      experiences[expId].currentExp =
        !experiences[expId].currentExp;
      this.setState({
        [event.target.name]: event.target.checked,
        experiences: experiences
      });
    }
    this.setState({
      [event.target.name]: event.target.checked
    });
    console.log(this.state[event.target.name]);
  }

  render() {
    const { popup, currentExp, description, valids } = this.state;
    return (
      <>
        <Modal
          show={popup}
          onHide={this.handleClose}
          dialogClassName="modal-60w"
          centered={true}
        >
          <Modal.Header className="profile-popup--title" closeButton>
            <h3> AJOUTER UNE EXPÉRIENCE PROFESSIONNELLE </h3>
          </Modal.Header>
          <Modal.Body className="profile-popup--container profile-popup--exp">
            <div className="profile-popup--exp-group">
              <div className="profile-popup--exp-input">
                <div className={`profile-popup--exp-job${valids.title && valids.expContract ? '' : ' error'}`}>
                  <input
                    type="text"
                    placeholder="Intitulé du poste"
                    name="title"
                    onChange={this.handleTextChange}
                    style={!valids.title ? { border: '2px solid #D13E82' } : null}
                  />
                  <Select
                    className={`profile-popup--exp-job-select${valids.expContract ? '' : '-error'}`}
                    name="expContract"
                    onChange={this.handleSelectChange}
                    options={jobOptions}
                    placeholder="Sélectionnez"
                    style={!valids.expContract ? { border: '2px solid #D13E82' } : null}

                  />
                </div>
                {(!valids.title || !valids.expContract) && <p id="profile-popup--exp-title-error"> Veuillez saisir l&apos;intitulé du poste et le type d&apos;emploi</p>}
                <div>
                  <input
                    type="text"
                    placeholder="Entreprise"
                    name="enterprise"
                    onChange={this.handleTextChange}
                    style={!valids.enterprise ? { border: '2px solid #D13E82' } : null}
                  />
                  {!valids.enterprise && <p id="profile-popup--exp-enterprise-error"> Veuillez saisir le nom de l&apos;entreprise </p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Lieu (ville, pays)"
                    name="loc"
                    onChange={this.handleTextChange}
                    style={!valids.loc ? { border: '2px solid #D13E82' } : null}
                  />
                  {!valids.loc && <p id="profile-popup--exp-loc-error"> Veuillez saisir le lieu de l&apos;entreprise </p>}
                </div>
                <span>
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      name="currentExp"
                      id="expJobHired"
                      value="expJobHired"
                      onChange={this.handleCheckboxChange}
                      checked={currentExp}
                    />
                    <label className="checkbox-label" htmlFor="expJobHired"> J&apos;occupe actuellement ce poste </label>
                  </div>
                </span>
                <div className="profile-popup--exp-duration">
                  <div style={!valids.startExp ? { border: '2px solid #D13E82' } : null}>
                    <span> Date de début: </span>
                    <DatePicker
                      className="profile--datepicker"
                      dateFormat="dd/MM/yyyy"
                      selected={this.state.startExp}
                      placeholderText={"DD/MM/AAAA"}
                      disabledKeyboardNavigation
                      onChange={(date, e) => this.handleDateChange(date, 'startExp', e)}
                    />
                  </div>
                  <div style={!valids.endExp ? { border: '2px solid #D13E82' } : null}>
                    <span> Date de fin: </span>
                    {
                      currentExp ?
                        <> <p> Aujourd&apos;hui </p></>
                        :
                        <DatePicker
                          className="profile--datepicker"
                          dateFormat="dd/MM/yyyy"
                          selected={this.state.endExp}
                          placeholderText={"DD/MM/AAAA"}
                          disabledKeyboardNavigation
                          onChange={(date) => this.handleDateChange(date, 'endExp')}
                        />
                    }
                  </div>
                </div>
                {(!valids.startExp || !valids.endExp) && <p id="profile-popup--exp-date-error"> Veuillez saisir une date de début et de fin valide (format: dd/mm/yyyy) </p>}
                {this.renderCurrentExp()}

              </div>
              <div className="profile-popup--exp-description">
                <textarea
                  name="description"
                  placeholder="Description..."
                  onChange={this.handleTextChange}
                  value={description}
                ></textarea>
              </div>
              <button onClick={this.handleSubmit}> ENREGISTRER </button>
            </div>

          </Modal.Body>
        </Modal>
      </>
    );
  }
}


profileExp.defaultProps = {
  history: {},
  handlePopupState: null,
  profileExperiences: [],
  handleProfileInputs: null
};

profileExp.propTypes = {
  history: PropTypes.object,
  handlePopupState: PropTypes.func,
  profileExperiences: PropTypes.array,
  handleProfileInputs: PropTypes.func,
};

export default profileExp;