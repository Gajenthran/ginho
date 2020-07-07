import React from 'react';
import PropTypes from 'prop-types';
import ProfileHead from './ProfileHead';
import ProfileBio from './ProfileBio';
import ProfileLanguages from './ProfileLanguages';
import ProfileExp from './ProfileExperiences';
import ProfileImage from './ProfileImage';
import { Navbar, Nav } from 'react-bootstrap';
import InputTags from './../InputTags';
import { mergeArrays, arrayToObject } from './../../utils/utils';

const MONTH_CONV = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

const inputTagsSettings = {
  pskills: {
    classNames: {
      tagInputField: 'profile--tags-sskills',
      tagInput: 'profile--tags-sskills',
      selected: 'profile--selected-sskills'
    },
    placeholder: 'Ajouter compétence'
  },
  industry: {
    classNames: {
      tagInputField: 'profile--tags-industry',
      tagInput: 'profile--tags-industry',
      selected: 'profile--selected-industry'
    },
    placeholder: 'Ajouter industrie'
  },
  title: {
    classNames: {
      tagInputField: 'profile--tags-title',
      tagInput: 'profile--tags-title',
      selected: 'profile--selected-title'
    },
    placeholder: 'Ajouter titre'
  },
  tools: {
    classNames: {
      tagInputField: 'profile--tags-tools',
      tagInput: 'profile--tags-tools',
      selected: 'profile--selected-tools'
    },
    placeholder: 'Ajouter outil'
  }
}

const popups = {
  "bio": 1,
  "languages": 2,
  "exp": 3,
  "head": 4,
  "image": 5
};

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.nbRecommendations = 2;
    // to remove until we didn't get db
    const pskills = ['Javascript', 'Java', 'Python'];
    const sskills = ['C++', 'C', 'Swift', 'Java'];
    const ind = ['Fullstack', 'Front-end', 'App mobile', 'Gestion de BDD'];
    const tools = ['NodeJS', 'ReactJS', 'AngularJS', 'Bootstrap'];
    const experiences = ['Développeur Front-End', 'Développeur Fullstack', 'Javascript', 'Relationnel', 'Restauration', 'Gestion'];

    var suggestionsList = mergeArrays(ind, tools, experiences, sskills);
    suggestionsList = suggestionsList.filter(v => !pskills.includes(v));

    this.state = {
      image: require('./../../assets/img/profile.png'),
      imageUrl: './../../assets/img/profile.png',
      initialize: false,
      profileHead: {
        firstName: '',
        lastName: '',
        address: '',
        travelLoc: '',
        title: '',
        experienceYear: ''
      },
      bio: '',
      profileLanguages: {
        languages: [],
        levels: []
      },
      profileExperiences: [],
      profile: null,
      online: true,
      recommendation: 0,
      expHover: false,
      pskills: arrayToObject(pskills),
      sskills: arrayToObject(sskills),
      industries: arrayToObject(ind),
      tools: arrayToObject(tools),
      suggestions: suggestionsList,
      newTagAdded: "",
      popupState: 0
    };

    this.handleDrop = this.handleDrop.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchUpdateInfo = this.fetchUpdateInfo.bind(this);
    this.handleToggleOnline = this.handleToggleOnline.bind(this);
    this.prevRecommendation = this.prevRecommendation.bind(this);
    this.nextRecommendation = this.nextRecommendation.bind(this);
    this.updateSuggestions = this.updateSuggestions.bind(this);
    this.renderSuggestions = this.renderSuggestions.bind(this);
    this.handleAddSkills = this.handleAddSkills.bind(this);
    this.handleExpHover = this.handleExpHover.bind(this);
    this.handlePopupState = this.handlePopupState.bind(this);
    this.handleProfileInputs = this.handleProfileInputs.bind(this);
    this.renderProfilePopup = this.renderProfilePopup.bind(this);
    this.updateProfileBio = this.updateProfileBio.bind(this);
    this.updateProfileLanguages = this.updateProfileLanguages.bind(this);
    this.updateProfileExperiences = this.updateProfileExperiences.bind(this);
    this.updateProfileImage = this.updateProfileImage.bind(this);

  }

  handleExpHover(event) {
    this.setState({
      expHover:
        event.nativeEvent.type === 'mouseover' ?
          true : false
    });
  }


  updateSuggestions(tags, key, tag, option) {
    var { suggestions, newTagAdded } = this.state;
    if (key === "pskills") {
      newTagAdded = "";
    } else {
      if (option === "delete" && tag) {
        suggestions = suggestions.filter(s => s !== tag.id);
      } else if (option === "add" && tag) {
        if (!suggestions.includes(tag.id))
          suggestions.push(tag.id);
      }
    }

    this.setState({
      newTagAdded: newTagAdded,
      [key]: tags,
      suggestions: suggestions
    })
  }

  handleToggleOnline() {
    this.setState({ online: !this.state.online });
  }

  prevRecommendation() {
    this.setState({
      recommendation: (this.state.recommendation - 1) % this.nbRecommendations
    });
  }

  nextRecommendation() {
    this.setState({
      recommendation: (this.state.recommendation + 1) % this.nbRecommendations
    });
  }

  handleDrop(dropped) {
    this.setState({ image: dropped[0] })
  }

  handleAddSkills(tag) {
    this.setState({ newTagAdded: tag });
  }

  renderSuggestions() {
    if (this.state.suggestions.length === 0)
      return null;

    return (
      <div className="profile-user--pskills-suggestions">
        <div> Suggestions: </div>
        <div className="profile-user--pskills-suggestions-tags">
          {this.state.suggestions.map(s =>
            <div key={s} onClick={() => this.handleAddSkills(s)}> {s} </div>
          )}
        </div>
      </div>
    );
  }

  renderExperiences() {
    return (this.state.profileExperiences.map((exp, i) => {
      return (
        <span key={i}>
          <div className="profile-user--tag">
            <div> Développeur Front-end </div>
            <div> Développeur Fullstack </div>
            <div> Javascript </div>
          </div>

          <h4> {exp.enterprise} </h4>
          <h5>
            {
              exp.currentExp === true ?
                <> (DEPUIS {MONTH_CONV[exp.startExp.getMonth()]} {exp.startExp.getFullYear()}) </>
                :
                <> ({MONTH_CONV[exp.startExp.getMonth()]} {exp.startExp.getFullYear()} - {MONTH_CONV[exp.endExp.getMonth()]} {exp.endExp.getFullYear()}) </>

            }

          </h5>
          <div className="profile-user--exp-content">
            <div id="exp-empty-promotion"></div>
            <div>
              <h4> {exp.title} </h4>
              {<p> {exp.description} </p>/* exp.description.map((d, i) => <p key={i}> {d} </p>) */}
            </div>
          </div>

          <i className="fas fa-pen"></i>
        </span>
      );
    }));
  }

  async fetchUpdateInfo(url, data) {
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
    this.fetchUpdateInfo(
      '/api/user/createProfile',
      this.state.user
    )
      .then(res => console.log(res));
  }

  handleRadioChange(event) {
    const { user } = this.state;
    user[event.target.name] = parseInt(event.currentTarget.value);
    this.setState({ user });
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;

    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  }

  handlePopupState(popupState) {
    this.setState({ popupState });
  }

  updateProfileBio(bio) {
    this.setState({ bio });
  }

  updateProfileLanguages(profileLanguages) {
    this.setState({ profileLanguages });
  }

  updateProfileExperiences(profileExperiences) {
    this.setState({ profileExperiences });
  }

  updateProfileImage(image) {
    this.setState({ image });
  }

  handleProfileInputs(profileId, profileInputs) {
    var profile = {};
    for (let input in profileInputs)
      profile[input] = profileInputs[input];
    this.setState({ [profileId]: profile });
  }

  static getDerivedStateFromProps(props, prevState) {
    if (
      props['profile'] &&
      prevState.initialize === false
    ) {
      const { profile } = props;
      console.log(profile);
      if (profile !== null) {
        var experiences = [],
          travels = [
            { loc: null, radius: '', partTime: false, clicked: false },
            { loc: null, radius: '', partTime: false, clicked: false },
            { loc: null, radius: '', partTime: false, clicked: false },
          ];
        profile['experiences'].forEach(exp => {
          var startExp = new Date(exp.start_exp),
            endExp = exp.current_exp === false ? new Date(exp.end_exp) : null;
          experiences.push({
            expContract: exp.contract,
            title: exp.title,
            startExp: startExp,
            endExp: endExp,
            enterprise: exp.enterprise,
            loc: exp.loc_id,
            description: exp.description, //.split('\n'),
            currentExp: exp.current_exp,
            endingCurrentExp: exp.ending_job
          });
        });
        console.log(profile['travels'][0]['travel_cities'][0], travels);
        profile['travels'][0]['travel_cities'].forEach((travel, i) => {
          travels[i]['city'] = profile['travels'][0]['travel_cities'][i];
          travels[i].country = profile['travels'][0]['travel_countries'][i];
          travels[i].lat = profile['travels'][0]['travel_lats'][i];
          travels[i].lng = profile['travels'][0]['travel_lngs'][i];
          travels[i].radius = profile['travels'][0]['travel_radius'][i];
          travels[i].partTime = profile['travels'][0]['travel_part_times'][i];
        });
        console.log(profile['travels'][0]['travel_cities'][0], travels);
        return ({
          profileHead: {
            firstName: profile['first_name'] || '',
            lastName: profile['last_name'] || '',
            address: profile['adress_id'] || '',
            title: profile['title'] || '',
            experienceYear: profile['experience_year'] || '',
            salaryBox: new Map(),
            // TODO: localisation
            travels: travels,
            contract: profile['contract'] || [],
            freelanceSalary: profile['freelance_salary'] || '',
            employmentSalary: profile['employment_salary'] || '',
            apprenticeSalary: profile['apprentice_salary'] || '',
            disponibilityFrom: new Date(profile['disponibility_from']) || '',
            disponibilityNotice: profile['disponibility_notice'] || '',
            partialTelework: profile['partial_telework'] || '',
            immediately: profile['immediately'] || false,
            partTime: profile['part-time'] || false,
            alternance: profile['alternance'] || false,
            loc: {
              country: profile['loc_country'] || null,
              city: profile['loc_city'] || null,
              lng: profile['loc_lng'] || null,
              lat: profile['loc_lat'] || null,
            }
          },
          bio: profile['biography'],
          profileLanguages: {
            languages: profile['languages'] || [],
            levels: profile['language_levels'] || []
          },
          profileExperiences: experiences,
          image: /* profile['image'] || */ require('./../../assets/img/profile.png'),
          initialize: true
        });
      }
    }
    return null;
  }

  renderProfilePopup() {
    switch (this.state.popupState) {
      case popups['image']:
        return (
          <ProfileImage
            {...this.props}
            image={this.state.image}
            imageUrl={this.state.imageUrl}
            handlePopupState={this.handlePopupState}
            handleProfileInputs={this.updateProfileImage}
          />
        );
      case popups['head']:
        return (
          <ProfileHead
            {...this.props}
            profileHead={this.state.profileHead}
            handlePopupState={this.handlePopupState}
            handleProfileInputs={this.handleProfileInputs}
          />
        );
      case popups['bio']:
        return (
          <ProfileBio
            {...this.props}
            bio={this.state.bio}
            handlePopupState={this.handlePopupState}
            handleProfileInputs={this.updateProfileBio}
          />
        );
      case popups['languages']:
        return (
          <ProfileLanguages
            {...this.props}
            profileLanguages={this.state.profileLanguages}
            handlePopupState={this.handlePopupState}
            handleProfileInputs={this.updateProfileLanguages}
          />
        );
      case popups['exp']:
        console.log(this.state.profileExperiences);
        return (
          <ProfileExp
            {...this.props}
            profileExperiences={this.state.profileExperiences}
            handlePopupState={this.handlePopupState}
            handleProfileInputs={this.updateProfileExperiences}
          />
        );
      default:
        break;
    }
  }

  render() {
    const { popupState, expHover, newTagAdded, bio } = this.state;
    const { profileHead } = this.state;
    return (
      <>
        <Navbar className="navbar-user">
          <Navbar.Brand
            className="navbar-user--link"
            id="navbar-user--online-link"
            href={null}
            onClick={this.handleToggleOnline}
          >
            {this.state.online ?
              <div> <img src={require('./../../assets/img/toggle-on.png')} className="fa-toggle-on" alt="toggle-on" /> <span> EN LIGNE </span> </div>
              : <div> <img src={require('./../../assets/img/toggle-off.png')} className="fa-toggle-off" alt="toggle-off" /> <span> HORS LIGNE </span> </div>
            }
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
            </Nav>
            <Nav className="navbar-user--right-link">
              <Nav.Link className="navbar-user--link" href={null}>
                <div> <i className="far fa-paper-plane"></i><span> MISSIONS </span> </div>
              </Nav.Link >
              <Nav.Link className="navbar-user--link" href={null}>
                <div> <img src={require('./../../assets/img/amz+.png')} alt="amz+"></img><span> PREMIUM </span> </div>
              </Nav.Link >
              <Nav.Link className="navbar-user--link" href={null}>
                <div> <i className="fas fa-link"></i><span> AMA </span> </div>
              </Nav.Link >
              <Nav.Link className="navbar-user--link" href={null}>
                <div> <i className="fas fa-cog"></i><span> MISSIONS </span> </div>
              </Nav.Link >
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="profile-user">
          <div id="profile-user--sidebar">
            <span>
              <h2 className="profile-user--title"> BIENVENUE À BORD </h2>
              <div className="profile-user--progression">
                <img src={require("./../../assets/img/progression.png")} alt="progression" />
                <div className="profile-user--progression-list">
                  <div className="profile-user--progression-item">
                    <div> Titre </div> <img src={require("./../../assets/img/plus.png")} alt="plus" />
                  </div>
                  <div className="profile-user--progression-item">
                    <div> Photo de profil </div> <img src={require("./../../assets/img/plus.png")} alt="plus" />
                  </div>
                  <div className="profile-user--progression-item">
                    <div> Numéro de téléphone </div> <img src={require("./../../assets/img/plus.png")} alt="plus" />
                  </div>
                  <div className="profile-user--progression-item">
                    <div> Localisation </div> <img src={require("./../../assets/img/plus.png")} alt="plus" />
                  </div>
                  <div className="profile-user--progression-item">
                    <div> Expériences </div> <img src={require("./../../assets/img/plus.png")} alt="plus" />
                  </div>
                </div>
              </div>
            </span>
            <span className="profile-user--sidebar-sponso"> <img src={require('./../../assets/img/hero.png')} alt="" /> </span>
            <span className="profile-user--sidebar-sponso"> <img src={require('./../../assets/img/hero.png')} alt="" /> </span>
          </div>

          <div id="profile-user--main">
            <div id="profile-user--pp">
              <div className="profile-user--image">
                <img
                  src={this.state.image}
                  alt="pp"
                  onClick={() => this.handlePopupState(popups['image'])}
                />
                <div className="profile-user--image-bottom">
                  <span id="profile-user--image-bottom-fav"> 3 <i className="fas fa-star"></i></span>
                  &nbsp;I
                  <span>
                    {this.state.profileHead.freelanceSalary ? ` ${this.state.profileHead.freelanceSalary}€` : " [550€]"}&nbsp;I
                    {this.state.profileHead.employmentSalary ? ` ${this.state.profileHead.employmentSalary}K€` : " [55K€]"}
                  </span>
                </div>
                <div className="profile-user--image-top">
                  <span> Disponible </span>
                </div>
                <div className="profile-user--image-right">
                  <img src={require("./../../assets/img/vizualization.png")} alt="vizualization" />
                </div>
                <div className="profile-user--image-top-middle">
                  <img src={require("./../../assets/img/certified.png")} alt="certified" />
                </div>
              </div>
              <div id="profile-user--informations">
                <div>
                  <h2 className="profile-user--title"> {profileHead['firstName']} </h2>
                  {
                    profileHead['title'] && profileHead['experienceYear'] ?
                      <h3> {profileHead['title']} ({profileHead['experienceYear']} {+profileHead['experienceYear'] < 2 ? 'an' : 'ans'}) </h3>
                      :
                      <h3> [ TITRE ] </h3>
                  }
                </div>
                <div id="profile-user--informations-container">
                  <div>
                    <p> <i className="fas fa-map-marker-alt"></i>  Lille </p>
                    <p> <i className="fas fa-walking"></i> Hauts de France, Ile de France, Bruxelles </p>
                  </div>
                  <div>
                    <p> Permis B - Non véhiculée </p>
                    <p> Temps complet / Temps partiel </p>
                  </div>
                </div>
              </div>
              <i className="fas fa-pen" onClick={() => this.handlePopupState(popups['head'])}></i>
            </div>
            <div id="profile-user--pskills">
              <h2 className="profile-user--title"> COMPÉTENCES CLÉS <i> (12 maximum) </i></h2>
              <span>
                <InputTags
                  tagList={this.state.pskills}
                  updateSuggestions={this.updateSuggestions}
                  keyTags="pskills"
                  newTag={newTagAdded}
                  settings={inputTagsSettings['pskills']}
                />
                {this.renderSuggestions()}
              </span>
            </div>
            <div id="profile-user--scorecard">
              <h2 className="profile-user--title"> SCORECARD </h2>
              <div className="profile-user--group-row">
                <span>
                  <img className="fa-img-aa" src={require("./../../assets/img/aa.png")} alt="aa" />
                  <h4> 200 CARACTÈRES </h4>
                  <p> {bio}</p>
                  <i className="fas fa-pen" onClick={() => this.handlePopupState(popups['bio'])}></i>
                </span>
                <span>
                  <i className="fas fa-language"></i>
                  <h4> LANGUES </h4>
                  <span>
                    {this.state.profileLanguages['languages'].map(
                      (l, i) => <p key={i}> {l} - {this.state.profileLanguages['levels'][i]} </p>
                    )}
                    <i className="fas fa-pen"></i>
                  </span>
                  <i className="fas fa-pen" onClick={() => this.handlePopupState(popups['languages'])}></i>
                </span>
                <span>
                  <i className="fas fa-briefcase"></i>
                  <h4> INDUSTRIES <i> (6 maximum) </i></h4>
                  <InputTags
                    tagList={this.state.industries}
                    updateSuggestions={this.updateSuggestions}
                    keyTags="industries"
                    settings={inputTagsSettings['industry']}
                  />
                </span>
              </div>
            </div>
            <div id="profile-user--sskills">
              <h2 className="profile-user--title"> AUTRES COMPÉTENCES </h2>
              <div className="profile-user--group-row">
                <span>
                  <h4> TITRE LIBRE </h4>
                  <InputTags
                    tagList={this.state.sskills}
                    updateSuggestions={this.updateSuggestions}
                    keyTags="sskills"
                    settings={inputTagsSettings['title']}
                  />
                </span>
                <span>
                  <h4> OUTILS </h4>
                  <InputTags
                    tagList={this.state.tools}
                    updateSuggestions={this.updateSuggestions}
                    keyTags="tools"
                    settings={inputTagsSettings['tools']}
                  />
                </span>
              </div>
            </div>
            <div id="profile-user--exp">
              <div className="profile-user--exp-add-container">
                <h2 className="profile-user--title"> EXPÉRIENCES PROFESSIONNELLES </h2>
                <div
                  onClick={() => this.handlePopupState(popups['exp'])}
                  className={expHover ? "profile-user--exp-add-hover" : "profile-user--exp-add"}
                  onMouseOver={this.handleExpHover}
                  onMouseLeave={this.handleExpHover}
                >
                  <i className="fas fa-plus"></i>
                  <span> AJOUTER UNE EXPÉRIENCE </span>
                </div>
              </div>
              <div className="profile-user--group-col">
                {this.renderExperiences()}
                <span>
                  <div className="profile-user--tag">
                    <div> Développeur Front-end </div>
                    <div> Développeur Fullstack </div>
                    <div> Javascript </div>
                  </div>
                  <h4> AMA ASSOCIATES (FRANCE / BELGIQUE) </h4>
                  <h5> (DEPUIS JANVIER 2019) </h5>
                  <div className="profile-user--exp-content">
                    <div>
                      <div id="exp-circle"></div>
                      <div id="exp-line"></div>
                    </div>
                    <div>
                      <h4> Digital Marketing Lead Sénior </h4>
                      <p> En charge de la gestion de l’image de marque lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>
                      <p> Responsable de la communication (community management, event) lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                      <p> Responsable de la communication lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                    </div>
                  </div>

                  <div className="profile-user--exp-content">
                    <div>
                      <div id="exp-circle"></div>
                      <div id="exp-line"></div>
                    </div>
                    <div>
                      <h4> Digital Marketing Lead </h4>
                      <p> En charge de la gestion de l’image de marque lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>
                      <p> Responsable de la communication (community management, event) lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                    </div>
                  </div>
                  <div className="profile-user--exp-content">
                    <div>
                      <div id="exp-circle"></div>
                    </div>
                    <div>
                      <h4> Digital Marketing Lead Junior </h4>
                      <p> En charge de la gestion de l’image de marque lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>
                    </div>
                  </div>
                  <i className="fas fa-pen"></i>
                </span>
                <span>
                  <div className="profile-user--tag">
                    <div> Relationnel </div>
                    <div> Restauration </div>
                    <div> Gestion </div>
                  </div>
                  <h4> HIPPOPOTAMUS (FRANCE) </h4>
                  <h5> (MAI 2017 - DÉCEMBRE 2018) </h5>

                  <div className="profile-user--exp-content">
                    <div id="exp-empty-promotion"></div>
                    <div>
                      <h4> cheffe de Rang/hôtesse de Table </h4>
                      <p> En charge de la gestion d’une zone de restauran balbalabla lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                      <p> Blabla (orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                    </div>
                  </div>
                  <i className="fas fa-pen"></i>
                </span>
              </div>
            </div>
            <div id="profile-user--formations">
              <h2 className="profile-user--title"> FORMATIONS </h2>
              <div id="profile-user--formations-group">
                <div>
                  <span className="profile-user--formations-date"> 2020 </span>
                  <span> Master Management du Design de Communication - Efficom Lille </span>
                </div>
                <div>
                  <span className="profile-user--formations-date"> 2018 </span>
                  <span> Licence Etudes cinématographiques - Université CHARLES DE GAULLE LILLE </span>
                </div>
                <div>
                  <span className="profile-user--formations-date"> 2013 </span>
                  <span> Baccalauréat Littéraire - Mention AB - Lycée Jean-François Millet - Cherbourg </span>
                </div>
              </div>
              <i className="fas fa-pen"></i>
            </div>
            <div id="profile-user--others">
              <h2 className="profile-user--title"> PASSIONS ET RECOMMANDATIONS </h2>
              <div className="profile-user--group-row">
                <span>
                  <i className="fas fa-heart"></i>
                  <h4> PASSIONS </h4>
                  <p> Cours de Fitness 3 fois dans la semaine </p>
                  <p> Produits beauté &amp; ménagers Homemade </p>
                  <p> Relaxation ASMR </p>
                  <i className="fas fa-pen"></i>
                </span>
                <span id="profile-user--others-reco">
                  <i className="fas fa-star"></i>
                  <h4> RECOMMANDATIONS </h4>
                  <i className="fas fa-angle-left" onClick={this.prevRecommendation}></i>
                  <i className="fas fa-angle-right" onClick={this.nextRecommendation}></i>
                  <div>
                    <div id="profile-user--reco">
                      {this.state.recommendation === 0 ?
                        <div className="profile-user--reco-slide">
                          <p> &quot; Enora est incroyable, elle mérite d’être invitée au Makisu au moins 3 fois par semaine. &quot; </p>
                          <p> Maxime FLEZ (CEO d&apos;AMA Associates) </p>
                        </div>
                        :
                        <div className="profile-user--reco-slide">
                          <p> &quot; Enora est forte, elle n&apos;a aucun défaut. &quot; </p>
                          <p> Gajentran PANCHA (Web dév d&apos;AMA Associates) </p>
                        </div>
                      }
                    </div>
                  </div>
                  <i className="fas fa-pen"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        {popupState && this.renderProfilePopup()}
      </>
    );
  }
}

Profile.defaultProps = {
  history: {},
  profile: {}
};

Profile.propTypes = {
  history: PropTypes.object,
  profile: PropTypes.object
};

export default Profile;