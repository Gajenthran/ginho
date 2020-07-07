import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom';
import Places from './../../places/widget';

const apprenticeOptions = [
  { value: "Rémunéré", label: "Rémunéré" },
  { value: "Non rémunéré", label: "Non rémunéré" },
  { value: "Sans préférence", label: "Sans préférence" }
];

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);


const numberRegex = /^[0-9\b]+$/;

const Checkbox = ({ type = 'checkbox', name, checked = false, id, onChange }) => (
  <input type={type} name={name} id={id} checked={checked} onChange={onChange} />
);

const LabelInput = ({ type = 'text', date = false, value = '', startDate, onDateChange, className, name, placeholder, text, endText, onChange }) => (
  <span className={className}>
    {text}
    {
      date ?
        <DatePicker
          className="profile--datepicker"
          selected={startDate || new Date()}
          placeholderText={placeholder}
          onChange={onDateChange}
        />
        :
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value || ''}
        />

    }
    {endText}
  </span>
);

const mapToObject = map => {
  var obj = {};
  let entries = map.entries();
  let values = entries.next().value;
  while (values !== undefined) {
    obj[values[0]] = values[1];
    values = entries.next().value;
  }
  return obj;
};

const FREELANCE_CONTRACT_DB = {
  'cddContract': 0, 'apprentissageContract': 1,
  'proContract': 2, 'stageContract': 3,
  'freelanceContract': 4, 'cdiContract': 5,
};

const FREELANCE_DISPONIBILITY_DB = {
  'immediately': 0, 'disponibilityFrom': 1,
  'disponibilityNotice': 2
};

const FREELANCE_MANAGEMENT_DB = {
  'partialTelework': 0, 'partTime': 1,
  'alternance': 2
};

const SALARY_BOX = {
  'cddContract': 0, 'apprentissageContract': 0,
  'proContract': 0, 'stageContract': 2,
  'freelanceContract': 1, 'cdiContract': 0,
};

const jobContractCb = [
  {
    name: 'freelanceContract',
    key: 'freelanceContract',
    label: 'Freelance'
  },
  {
    name: 'cddContract',
    key: 'cddContract',
    label: 'CDD'
  },
  {
    name: 'proContract',
    key: 'proContract',
    label: 'Professionnalisation'
  },
  {
    name: 'cdiContract',
    key: 'cdiContract',
    label: 'CDI'
  },
  {
    name: 'stageContract',
    key: 'stageContract',
    label: 'Stage'
  },
  {
    name: 'apprentissageContract',
    key: 'apprentissageContract',
    label: 'Apprentissage'
  },
];


class ProfileHead extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popup: true,
      initialize: false,
      profile: {
        firstName: '',
        lastName: '',
        title: '',
        experienceYear: '',
        freelanceSalary: '',
        freelanceWonSalary: '',
        employmentSalary: '',
        employmentWonSalary: '',
        apprenticeSalary: {},
        travels: [],
        travelsCheck: [], // new Map(),
        disponibility: new Map(),
        jobManagement: new Map(),
        jobContract: new Map(),
        partialTelework: '',
        disponibilityNotice: '',
        disponibilityFrom: null,
        alternance: false,
        partTime: false,
        immediately: false,
        loc: null,
      },
      clickedId: 0,
      salaryBox: new Map([
        [0, false],
        [1, false],
        [2, false]
      ])
    };


    this.handleClose = this.handleClose.bind(this);
    this.handleCheckboxesChange = this.handleCheckboxesChange.bind(this);
    this.renderJobContract = this.renderJobContract.bind(this);
    this.renderJobManagement = this.renderJobManagement.bind(this);
    this.renderDisponibility = this.renderDisponibility.bind(this);
    this.renderLoc = this.renderLoc.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextClicked = this.handleTextClicked.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.updateLoc = this.updateLoc.bind(this);
    this.updateTravels = this.updateTravels.bind(this);
    this.updateTravelsClicked = this.updateTravelsClicked.bind(this);

    this.jobManagementCb = [
      {
        name: 'partialTelework',
        key: 'partialTelework',
        label: 'null'
      },
      {
        name: 'partTime',
        key: 'partTime',
        label: 'Temps partiel'
      },
      {
        name: 'alternance',
        key: 'alternance',
        label: 'Alternance'
      },
    ];

    this.locCb = [
      {
        name: 'partTime',
        key: 'parttTime',
        label: 'Temps partiel'
      },
      {
        name: 'radius',
        key: 'radius',
        label: 'null'
      }
    ];

    this.disponibilityCb = [
      {
        name: 'immediately',
        key: 'immediately',
        label: 'Immédiatement'
      },
      {
        name: 'disponibilityFrom',
        key: 'disponibilityFrom',
        label: ''
      },
      {
        name: 'disponibilityNotice',
        key: 'disponibilityNotice',
        label: 'null'
      },
    ];
  }

  handleDateChange(date) {
    var { profile } = this.state;
    profile['disponibilityFrom'] = date;
    profile['disponibility']['disponibilityFrom'] = true;
    this.setState({ profile });
  }

  mergeProfile(profile, map, travels = false) {
    if (travels) {
      for (let i = 0; i < map.length; i++) {
        let entries = map[i].entries();
        let values = entries.next().value;
        console.log(entries, values);
        while (values !== undefined) {
          switch (values[0]) {
            case 'radius':
              profile['travels'][i][values[0]] =
                values[1] ? profile['travels'][i][values[0]] : null;
              break;
            case 'partTime':
              profile['travels'][i][values[0]] = values[1];
              break
            default:
              break;
          }
          values = entries.next().value;
        }
      }
    } else {
      let entries = profile[map].entries();
      let values = entries.next().value;
      while (values !== undefined) {
        switch (typeof profile[values[0]]) {
          case 'string':
            profile[values[0]] =
              values[1] && profile[values[0]] ? profile[values[0]] : "";
            break;
          case 'boolean':
            profile[values[0]] = values[1];
            break
          default:
            break;
        }
        values = entries.next().value;
      }
    }
    return profile;
  }

  static getDerivedStateFromProps(props, prevState) {
    const { profileHead } = props;
    if (
      profileHead &&
      prevState.initialize === false
    ) {
      prevState.profile['jobContract'] = new Map();
      prevState.profile['disponibility'] = new Map();
      prevState.profile['jobManagement'] = new Map();
      profileHead['travels'].forEach((t, i) => {
        prevState.profile['travelsCheck'].push(new Map());
        prevState.profile['travelsCheck'][i].set(
          'radius',
          t.radius ? true : false
        );
        prevState.profile['travelsCheck'][i].set(
          'partTime',
          t.partTime ? true : false
        );
      })
      Object.keys(FREELANCE_CONTRACT_DB).forEach(
        c => {
          let v = profileHead['contract'].includes(FREELANCE_CONTRACT_DB[c]);
          prevState.profile['jobContract'].set(c, v)
          if (prevState.salaryBox.get(SALARY_BOX[c]) !== true)
            prevState.salaryBox.set(SALARY_BOX[c], v);
        }
      );
      // TODO: check salaryBox
      Object.keys(FREELANCE_DISPONIBILITY_DB).forEach(
        c => {
          prevState.profile['disponibility'].set(
            c, profileHead[c] /* === true */ ? true : false
          );
        }
      );
      Object.keys(FREELANCE_MANAGEMENT_DB).forEach(
        c => {
          prevState.profile['jobManagement'].set(
            c, profileHead[c] /* === true */ ? true : false
          );
        }
      );
      return ({
        profile: Object.assign(prevState.profile, profileHead),
        salaryBox: prevState.salaryBox,
        initialize: true
      });
    }
    return null;
  }

  handleSubmit() {
    this.updateProfileInputs();
    var { profile } = this.state;
    profile = this.mergeProfile(profile, 'disponibility');
    profile = this.mergeProfile(profile, 'jobManagement');
    profile = this.mergeProfile(profile, profile.travelsCheck, true);
    profile.apprenticeSalary = profile.apprenticeSalary['label'] || "";
    profile['contract'] = mapToObject(profile['jobContract']);
    console.log(profile);
    /* profile = Object.assign({}, profile, {
      apprenticeSalary: profile.apprenticeSalary['label'],
      travels: profile.travels.map(input => (
        {
          loc: input['loc'],
          radius: input['radius']
        }
      ))
    });
    Object.keys(profile).forEach(key => {
      var entry;
      if (key === 'jobContract') {
        profile['contract'] = []
        let entries = profile[key].entries();
        entry = entries.next().value;
        while (entry !== undefined) {
          if (entry[1] === true)
            profile['contract'].push(FREELANCE_CONTRACT_DB[entry[0]]);
          entry = entries.next().value;
        }
        delete profile[key];
      } else if (key === 'disponibility') {
        if (profile[key].get('immediately') === true) {
          profile['immediately'] = true;
        }
        if (profile[key].get('disponibilityNotice') !== true) {
          profile['disponibilityNotice'] = '';
        }
        delete profile[key];
      } else if (key === 'jobManagement') {
        let entries = profile[key].entries();
        entry = entries.next().value;
        while (entry !== undefined) {
          if (entry[0] === 'partialTelework' && entry[1] !== true) {
            profile['partialTelework'] = '';
          } else {
            profile[entry[0]] = entry[1];
          }
          entry = entries.next().value;
        }
        delete profile[key];
      } else if (key === 'travelsCheck') {
        let entries = profile[key].entries();
        entry = entries.next().value;
        while (entry !== undefined) {
          let [eVal, eIdx] = entry[0].split("_");
          if (eVal === 'radiusJob' && entry[1] !== true) {
            profile.travels[parseInt(eIdx - 1)].radius = '';
          } else {
            profile[entry[0]] = entry[1];
          }
          entry = entries.next().value;
        }
        delete profile[key];
      }
    }); */
    this.fetchUpdateProfile(
      '/api/user/updateProfileHead',
      profile
    );
    this.props.handlePopupState(0);
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

  handleSelectChange(selectedOption, action) {
    this.setState(state => ({
      profile: {
        ...state.profile,
        [action.name]: selectedOption
      }
    }));
  }


  handleTextClicked(event, index) {
    var { travels } = this.state.profile;

    for (let i = 0; i < travels.length; i++)
      travels[i]['clicked'] = index === i;
    this.setState({ travels })
  }

  renderLoc() {
    const { travelsCheck, travels } = this.state.profile;
    return (
      travels.map((t, tId) => {
        return (
          <div key={tId}>
            <InstantSearch indexName="instant_search" searchClient={searchClient}>
              <div className="search-panel">
                <div className="search-panel__results">
                  <Places
                    updateTravels={this.updateTravels}
                    updateTravelsClicked={this.updateTravelsClicked}
                    id='travels'
                    travelId={tId}
                    defaultRefinement={{
                      value: t['city'] ? `${t['city']}, ${t['country']}` : null
                    }}
                  />
                </div>
              </div>
            </InstantSearch>
            <div key={tId} className={`hidden ${tId === this.state.clickedId ? 'open' : ''}`}>
              {this.locCb.map((box, boxId) => {
                return (
                  <div
                    key={box.key}
                    className="checkbox-wrapper"
                  >
                    <Checkbox
                      name={box.name + tId}
                      id={box.name + tId}
                      checked={travelsCheck[tId].get(box.name)}
                      onChange={(e) => this.handleCheckboxesChange(e, 'travelsCheck', box.name, tId)}
                    />
                    <label
                      className="checkbox-label"
                      htmlFor={box.name + tId}
                    >
                      {boxId !== 0 ?
                        <LabelInput
                          className="profile-popup--head-lookingfor-preavis"
                          placeholder="..."
                          name="radius"
                          text="Rayon de"
                          endText="km"
                          onChange={(event) => this.handleTextChange(event, tId)}
                          value={t.radius}
                        />
                        :
                        'Temps partiel'
                      }
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })
    );
  }

  handleTextChange(event, index) {
    const { name, value } = event.target;
    var key = name, val = value;

    if (key === 'loc' || key === 'radius') {
      key = 'travels';
      val = this.state.profile['travels'];
      val[index][name] = value;
    }

    if (
      (
        key === 'experienceYear' ||
        key === 'freelanceSalary' ||
        key === 'freelanceWonSalary' ||
        key === 'employmentSalary' ||
        key === 'employmentWonSalary' ||
        key === 'partialTelework' ||
        key === 'disponibilityNotice'
      ) &&
      !(val === '' || numberRegex.test(val))
    )
      return;

    this.setState(state => ({
      profile: {
        ...state.profile,
        [key]: val
      }
    }));
  }

  updatePopupState() {
    this.props.handlePopupState(0);
  }

  updateProfileInputs() {
    this.props.handleProfileInputs(
      'profileHead',
      this.state.profile
    );
  }

  updateLoc(loc) {
    this.setState(state => ({
      profile: {
        ...state.profile,
        loc: loc
      }
    }));
  }

  updateTravelsClicked(clickedId) {
    this.setState({ clickedId })
  }

  updateTravels(travel, id) {
    var { travels } = this.state.profile
    travels[id] = travel;
    this.setState(state => ({
      profile: {
        ...state.profile,
        travels: travels
      }
    }));
  }

  handleProfileInputs(profileId, profileInputs) {
    var profile = {};
    for (let input in profileInputs)
      profile[input] = profileInputs[input];
    this.setState({ [profileId]: profile });
  }

  handleClose() {
    this.updatePopupState();
    this.setState({ popup: false });
  }

  handleCheckboxesChange(event, map, value, index) {
    const { name, checked } = event.target;
    if (map === 'travelsCheck') {
      this.setState(state => (
        { map: state.profile[map][index].set(value, checked) }
      ));
    } else {
      if (map === 'jobContract') {
        this.setState(state => ({
          map: state.profile[map].set(name, checked),
          salaryBox: state.salaryBox.set(SALARY_BOX[name], checked)
        }));
      } else {
        this.setState(state => ({
          map: state.profile[map].set(name, checked)
        }));
      }

    }
  }

  renderDisponibility() {
    const { disponibility } = this.state.profile;
    return this.disponibilityCb.map(dispo => {
      return (
        <div key={dispo.key} className="checkbox-wrapper">
          <Checkbox
            name={dispo.name}
            id={dispo.name}
            checked={disponibility.get(dispo.name)}
            onChange={(e) => this.handleCheckboxesChange(e, 'disponibility')}
          />
          <label
            className="checkbox-label"
            htmlFor={dispo.name}
          >
            {
              dispo.key === 'disponibilityFrom' ?
                <LabelInput
                  date={true}
                  placeholder="JJ/MM/AAAA"
                  text="A partir du "
                  name={dispo.key}
                  startDate={this.state['profile']['disponibilityFrom']}
                  onDateChange={this.handleDateChange}
                />
                :
                dispo.key === 'disponibilityNotice' ?
                  <LabelInput
                    className="profile-popup--head-lookingfor-preavis"
                    placeholder="..."
                    text="Préavis de"
                    endText="an(s)"
                    name="disponibilityNotice"
                    onChange={this.handleTextChange}
                    value={this.state.profile.disponibilityNotice}
                  />
                  :
                  dispo.label
            }
          </label>
        </div>
      );
    });
  }

  renderJobManagement() {
    const { jobManagement } = this.state.profile;
    return this.jobManagementCb.map(management => {
      return (
        <div key={management.key} className="checkbox-wrapper">
          <Checkbox
            name={management.name}
            id={management.name}
            checked={jobManagement.get(management.name)}
            onChange={(e) => this.handleCheckboxesChange(e, 'jobManagement')}
          />
          <label
            className="checkbox-label"
            htmlFor={management.name}
          >
            {management.key === 'partialTelework' ?
              <LabelInput
                className="profile-popup--head-lookingfor-preavis"
                placeholder="..."
                text="Télétravail partiel"
                endText="%"
                name="partialTelework"
                onChange={this.handleTextChange}
                value={this.state.profile.partialTelework}
              />
              :
              management.label
            }
          </label>
        </div>
      );
    });
  }

  renderJobContract() {
    const { jobContract } = this.state.profile;
    return jobContractCb.map(contract => {
      return (
        <div key={contract.key} className="checkbox-wrapper">
          <Checkbox
            name={contract.name}
            id={contract.name}
            checked={jobContract.get(contract.name)}
            onChange={(e) => this.handleCheckboxesChange(e, 'jobContract')}
          />
          <label
            className="checkbox-label"
            htmlFor={contract.name}
          >
            {contract.label}
          </label>
        </div>
      );
    });
  }

  render() {
    const { popup } = this.state;
    const { firstName, lastName, loc } = this.state.profile;
    return (
      <>
        <Modal
          show={popup}
          onHide={this.handleClose}
          dialogClassName="modal-60w"
          centered={true}
        >
          <Modal.Header className="profile-popup--title" closeButton>
            <h3> ÉDITER L&apos;INTRODUCTION </h3>
          </Modal.Header>
          <Modal.Body className="profile-popup--container profile-popup--head">
            <div className="profile-popup--head-group">
              <div className="profile-popup--head-who">
                <h3> VOUS ÊTES : </h3>
                <div className="profile-popup--head-who-last-name">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    onChange={this.handleTextChange}
                    value={firstName}
                  />
                </div>
                <div className="profile-popup--head-who-first-name">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    onChange={this.handleTextChange}
                    value={lastName}
                  />
                </div>
                <div className="profile-popup--head-who-title">
                  <input
                    type="text"
                    name="title"
                    placeholder="Ajouter votre poste actuel"
                    onChange={this.handleTextChange}
                    value={this.state.profile['title']}
                  />
                  <span>
                    Expérience:
                    <input
                      id="profile-popup--head-who-experiences"
                      name="experienceYear"
                      type="text"
                      placeholder="..."
                      onChange={this.handleTextChange}
                      value={this.state.profile['experienceYear']}
                    />
                    an(s)
                  </span>
                </div>
                <div>
                  <InstantSearch indexName="instant_search" searchClient={searchClient}>
                    <div className="search-panel">
                      <div className="search-panel__results">
                        <Places
                          updateLoc={this.updateLoc}
                          id='loc'
                          defaultRefinement={{
                            value: loc ? `${loc.city}, ${loc.country}` : null
                          }}
                        />
                      </div>
                    </div>
                  </InstantSearch>
                </div>
              </div>
              <div className="profile-popup--head-lookingfor">
                <h3> VOUS RECHERCHEZ : </h3>
                <div className="profile-popup--head-lookingfor-group">
                  <div className="profile-popup--head-lookingfor-disponibility">
                    <h4> DISPONIBILITÉ :  </h4>
                    {this.renderDisponibility()}
                  </div>
                  <div className="profile-popup--head-lookingfor-loc">
                    <h4> LOCALISATION :</h4>
                    {this.renderLoc()}
                  </div>
                  <div className="profile-popup--head-lookingfor-work">
                    <h4> GESTION DE TRAVAIL :</h4>
                    {this.renderJobManagement()}
                  </div>
                </div>
              </div>
              <div className="profile-popup--head-contract">
                <h3> VOTRE CONTRAT : </h3>
                <div>
                  {this.renderJobContract()}
                </div>
              </div>
              <div className="profile-popup--head-salary">
                <h3> VOS PRÉTENTIONS SALARIALES : </h3>
                {
                  this.state.salaryBox.get(SALARY_BOX['freelanceContract']) === true &&
                  <div className="profile-popup--head-salary-list">
                    <h4> FREELANCE : </h4>
                    <div>
                      <p> Vous souhaitez gagner
                      <span>
                          <input
                            type="text"
                            placeholder="500"
                            name="freelanceSalary"
                            onChange={this.handleTextChange}
                            value={this.state.profile.freelanceSalary}
                          />
                          <span>€/jour</span>
                        </span>
                      </p>
                      <p> Vous n&apos;acceptez rien en dessous de
                      <span><input type="text" placeholder="480" /><span>€/jour</span> </span>
                      </p>
                    </div>
                  </div>
                }
                {
                  this.state.salaryBox.get(SALARY_BOX['cddContract']) === true &&
                  <div className="profile-popup--head-salary-list" id="profile--popup-employment-salary">
                    <h4> EMBAUCHE : </h4>
                    <div>
                      <p> Vous souhaitez gagner
                    <span>
                          <input
                            type="text"
                            placeholder="67"
                            name="employmentSalary"
                            onChange={this.handleTextChange}
                            value={this.state.profile.employmentSalary}
                          />
                          <span>K€/jour</span>
                        </span>
                      </p>
                      <p> Vous n&apos;acceptez rien en dessous de
                    <span><input type="text" placeholder="60" /><span>K€/jour</span> </span>
                      </p>
                    </div>
                  </div>
                }
                {
                  this.state.salaryBox.get(SALARY_BOX['stageContract']) === true &&
                  <div className="profile-popup--head-salary-list">
                    <h4> STAGIAIRE : </h4>
                    <Select
                      className="profile-popup--head-salary-list-select"
                      name="apprenticeSalary"
                      value={this.state.profile.apprenticeSalary}
                      onChange={this.handleSelectChange}
                      options={apprenticeOptions}
                      placeholder="Sélectionnez"
                    />
                    <div>

                    </div>
                  </div>
                }
              </div>
              <button onClick={this.handleSubmit}> ENREGISTRER </button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}


ProfileHead.defaultProps = {
  history: {},
  handlePopupState: null,
  handleProfileInputs: null,
  profileHead: null
};

ProfileHead.propTypes = {
  history: PropTypes.object,
  handlePopupState: PropTypes.func,
  handleProfileInputs: PropTypes.func,
  profileHead: PropTypes.object
};

export default ProfileHead;