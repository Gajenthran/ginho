import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './../components/Navbar/Navbar';
import Footer from './../components/Footer/Footer';

const nameRegex = RegExp(/^\w{2,50}$/);
const titleRegex = RegExp(/^.{6,50}$/);
const rateRegex = RegExp(/^\d{2,5}(\.\d+)?$/); // Sans commencer par zéro

class CreateProfile extends React.Component {
  constructor(props) {
    super(props);

    this.step = [
      'title',
      'rate',
      'phone'
    ];

    this.state = {
      profile: null,
      state: '',
      title: '',
      skills: '',
      city: '',
      firstName: '',
      lastName: '',
      phone: '',
      sexe: 0,
      rate: '',
      category: '',
      valids: {
        title: false,
        skills: true, // TODO: Regexp
        city: true,
        firstName: false,
        lastName: false,
        phone: true,
        rate: false
      },
      forms: {
        title: true,
        rate: true,
        phone: true,
      }
    }

    this.renderState = this.renderState.bind(this);
    this.fetchGetProfile = this.fetchGetProfile.bind(this);
    this.checkProfileState = this.checkProfileState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleText = this.handleText.bind(this);
    this.handleRadio = this.handleRadio.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.validForm = this.validForm.bind(this);
    this.fetchUpdateProfile = this.fetchUpdateProfile.bind(this);
  }

  checkProfileState(profile) {
    var state = this.state['state'];
    for (const key in profile) {
      switch (key) {
        case 'title':
          if (profile[key] || profile[key] !== null)
            continue;
          state = key;
          break;
        case 'rate':
          if (profile[key] || profile[key] !== null)
            continue;
          state = key;
          break;
        case 'phone':
          if (profile[key] || profile[key] !== null)
            continue;
          state = key;
          break;
        default:
          break;
      }
      if (state.length > 0) break;
    }
    this.setState({
      state: state,
      profile: profile,
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
    });

    if (state.length === 0)
      this.props.history.push('/');
  }

  componentDidMount() {
    this.fetchGetProfile(
      '/api/user/getProfil'
    )
      .then(res => this.checkProfileState(res.profile))
  }

  async fetchGetProfile(url) {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('login')}`
      }
    });
    let res = await response.json();
    return res;
  }

  handlePrev() {
    let index = this.step.indexOf(this.state['state']);
    this.setState({ state: this.step[index - 1] });
  }

  validForm(forms) {
    for (let i = 0; i < forms.length; i++) {
      if (forms[i] === false)
        return false;
    }
    return true;
  }

  handleNext() {
    let index = this.step.indexOf(this.state['state']);
    const { valids, state, forms } = this.state;
    var v = forms;
    switch (state) {
      case 'title':
        v[state] = this.validForm([valids['title'], valids['skills']]);
        break;
      case 'rate':
        v[state] = this.validForm([valids['rate']]);
        break;
      case 'phone':
        v[state] = this.validForm([
          valids['city'],
          valids['firstName'],
          valids['lastName'],
          valids['phone']
        ]);
        console.log(v[state], valids['firstName'], valids['lastName'])
        break;
      default:
        break;
    }
    this.setState({ forms: v });
    if (v[state])
      this.setState({ state: this.step[index + 1] });
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

  handleText(event) {
    const { name, value } = event.target;
    var { valids } = this.state;
    switch (name) {
      case 'title':
        valids[name] = titleRegex.test(this.state[name]);
        break;
      case 'rate':
        valids[name] = rateRegex.test(this.state[name]);
        console.log(this.state[name], rateRegex.test(this.state[name]));
        break;
      case 'firstName':
        valids[name] = nameRegex.test(this.state[name]);
        console.log(this.state[name], nameRegex.test(this.state[name]));
        break;
      case 'lastName':
        valids[name] = nameRegex.test(this.state[name]);
        console.log(this.state[name], nameRegex.test(this.state[name]));
        break;
      default:
        break;
    }
    this.setState({
      [name]: value,
      valids: valids
    });
  }

  handleRadio(event) {
    this.setState({ [event.target.name]: parseInt(event.currentTarget.value) });
  }

  handleSubmit() {
    const { valids } = this.state;
    const valid = this.validForm([
      valids['city'],
      valids['firstName'],
      valids['lastName'],
      valids['phone']
    ]);
    console.log(valid, valids['city'],
      valids['firstName'],
      valids['lastName'],
      valids['phone']);
    if (valid) {
      const data = {
        title: this.state.title,
        skills: this.state.skills,
        city: this.state.city,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phone: this.state.phone,
        rate: this.state.rate,
        category: this.state.category
      };

      this.fetchUpdateProfile(
        '/api/user/createProfile',
        data
      )
        .then(res => this.createProfile(res))
    }
  }

  createProfile({ status }) {
    console.log("status");
    if (status === 200)
      this.props.history.push('/');
  }

  handleRadioChange(e) {
    this.setState({
      category: e.target.value
    });
  }

  renderState() {
    const {
      state, sexe, title,
      skills, rate, firstName, lastName,
      city, phone, forms
    } = this.state;
    const index = this.step.indexOf(state);
    const titleLength = 30 - title.length;
    if (state.length > 0) {
      switch (state) {
        case 'title':
          return (
            <>
              <p> Title </p>
              <input type="text" onChange={this.handleText} name="title" value={title} />
              <p style={{ color: titleLength > 0 ? 'black' : 'red' }}> {titleLength} </p>
              {!forms[state] && <p> Erreur lors de la saisie du titre. </p>}
              <p> Compétences </p>
              <input type="text" onChange={this.handleText} name="skills" value={skills} />
              {index > 0 &&
                <button onClick={this.handlePrev}> flèche gauche </button>
              }
              {index < this.step.length &&
                <button onClick={this.handleNext}> flèche droite </button>
              }
            </>
          );
        case 'rate':
          return (
            <>
              <p> Tarif / jour </p>
              <input type="text" onChange={this.handleText} name="rate" value={rate} />
              {!forms[state] && <p> Erreur lors de la saisie du tarif. </p>}

              {index > 0 &&
                <button onClick={this.handlePrev}> flèche gauche </button>
              }
              {index < this.step.length &&
                <button onClick={this.handleNext}> flèche droite </button>
              }
            </>
          );
        case 'phone':
          return (
            <>
              <h3> Informations personnelles </h3>
              <p> Civilité </p>
              <input type="radio" onChange={this.handleRadio} name="sexe" value={0} checked={sexe === 0} />
              <input type="radio" onChange={this.handleRadio} name="sexe" value={1} checked={sexe === 1} />
              <p> Prénom </p>
              <input type="text" onChange={this.handleText} name="firstName" value={firstName} />
              <p> Nom </p>
              <input type="text" onChange={this.handleText} name="lastName" value={lastName} />
              <p> Téléphone </p>
              <input type="text" onChange={this.handleText} name="phone" value={phone} />
              <p> Ville </p>
              <input type="text" onChange={this.handleText} name="city" value={city} />
              {index > 0 &&
                <button onClick={this.handlePrev}> flèche gauche </button>
              }
              {index < this.step.length &&
                <button onClick={this.handleSubmit}> flèche droite </button>
              }
            </>
          );
        default:
          return null;
      }
    }
  }

  handleCategory(event) {
    this.setState({ category: event.target.name })
  }

  renderCategory() {
    return (
      <>
        <button name="talent" onClick={this.handleCategory}> Talent </button>
        <button name="esn" onClick={this.handleCategory}> Intermédiaire </button>
        <button name="enterprise" onClick={this.handleCategory}> Entreprise </button>
      </>
    );
  }

  render() {
    const { category } = this.state
    return (
      <>
        <Navbar {...this.props} />
        <div className="create-profile--page">
          {category.length === 0 ?
            this.renderCategory()
            :
            this.renderState()
          }
          <Footer {...this.props} />
        </div>
      </>
    );
  }
}

CreateProfile.defaultProps = {
  history: {}
};

CreateProfile.propTypes = {
  history: PropTypes.object,
};

export default CreateProfile;