import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './../components/Navbar/Navy';
import Login from './../components/Proposal/LoginFull';
import Footer from './../components/Footer/Footer';
import auth from './../utils/auth';
import freelanceSelection from './../utils/freelanceSelection';

const subjectRegex = new RegExp(/^.{5,}$/);
const nameRegex = new RegExp(/^.{3,}$/);

class Proposal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subject: null,
      start: null,
      duration: false,
      loc: null,
      description: null,
      projectErrors: {
        subject: false,
        start: false,
        duration: false
      },
      name: null,
      country: null,
      city: null,
      type: '',
      phone: null,
      society: false,
      category: false,
      clientErrors: {
        name: false,
        country: false,
        city: false,
        type: false,
        phone: false
      },
      step: 0,
    }

    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmitProject = this.handleSubmitProject.bind(this);
    this.handleSubmitClient = this.handleSubmitClient.bind(this);
    this.fetchProposal = this.fetchProposal.bind(this);
    this.fetchSendProposal = this.fetchSendProposal.bind(this);
    this.fetchAddSociety = this.fetchAddSociety.bind(this);
    this.fetchGetFreelances = this.fetchGetFreelances.bind(this);
    this.validProjectForm = this.validProjectForm.bind(this);
    this.validClientForm = this.validClientForm.bind(this);
    this.renderProjectForm = this.renderProjectForm.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }

  componentDidMount() {
    this.fetchGetFreelances(
      '/api/user/getFreelances',
      localStorage.getItem('selection')
    )
      .then(res => console.log(res))
  }

  async fetchGetFreelances(url, data) {
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

  async fetchProposal(url) {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('login')}`
      },
    });
    let res = await response.json();
    return res;
  }

  async fetchSendProposal(url, data) {
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

  async fetchAddSociety(url, data) {
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

  handleTextChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleCheckboxChange(event) {
    this.setState({ [event.target.name]: event.target.checked })
  }

  handleRadioChange(event) {
    this.setState({ [event.target.name]: event.currentTarget.value });
  }

  checkClient(res) {
    console.log(res);
    this.setState({
      society: res.society,
      category: res.category,
    });
    if (res.society && res.category) {
      this.nextStep(3);
    } else if (!res.category) {
      this.props.history.push('/');
    }
  }

  nextStep(step) {
    this.setState({ step: step });
    const { category, society } = this.state;
    console.log(society, category);
    switch (step) {
      case 1:
        break;
      case 2:
        this.fetchProposal('/api/user/checkClient')
          .then(res => this.checkClient(res));
        break;
      case 3:
        this.sendProposal();
        break;
      default:
        break;
    }
  }

  validProjectForm() {
    var formErrors = this.state.projectErrors, valid = true;
    for (let p in this.state) {
      switch (p) {
        case 'subject':
          formErrors[p] = subjectRegex.test(this.state[p]);
          valid = formErrors[p] && valid;
          break;
        case 'start':
          formErrors[p] = this.state[p] || false;
          valid = formErrors[p] && valid;
          break;
        case 'duration':
          formErrors[p] = this.state[p] || false;
          valid = formErrors[p] && valid;
          break;
        default:
          break;
      }
    }

    this.setState({ projectErrors: formErrors });
    return valid;
  }

  validClientForm() {
    var formErrors = this.state.clientErrors, valid = true;
    for (let p in this.state) {
      switch (p) {
        case 'name':
          formErrors[p] = nameRegex.test(this.state[p]);
          valid = formErrors[p] && valid;
          break;
        case 'country':
          formErrors[p] = this.state[p] || false;
          valid = formErrors[p] && valid;
          break;
        case 'city':
          formErrors[p] = this.state[p] || false;
          valid = formErrors[p] && valid;
          break;
        case 'type':
          formErrors[p] = this.state[p].length !== 0;
          valid = formErrors[p] && valid;
          break;
        default:
          break;
      }
    }
    this.setState({ clientErrors: formErrors });
    return valid;
  }

  sendProposal() {
    const data = {
      freelances: freelanceSelection.get(),
      subject: this.state.subject,
      start: this.state.start,
      duration: this.state.duration,
      loc: this.state.loc,
      description: this.state.description
    };
    this.fetchSendProposal(
      'api/user/sendProposal',
      data
    );
    freelanceSelection.removeAll();
    this.props.history.push(
      `/proposal-sent${this.props.history.location.search}`
    );
  }

  handleSubmitProject() {
    if (this.validProjectForm()) {
      if (auth.isLogin()) {
        this.nextStep(2);
      } else {
        this.nextStep(1);
      }
    } else {
      console.log('false');
    }
  }

  handleSubmitClient() {
    if (this.validClientForm()) {
      const data = {
        name: this.state.name,
        country: this.state.country,
        city: this.state.city,
        type: this.state.type,
        phone: this.state.phone
      };
      this.fetchAddSociety(
        '/api/user/addSociety',
        data
      )
        .then(res => {
          if (res.status === 200) {
            this.nextStep(3)
          }
        });
    }
  }

  renderProjectForm() {
    return (
      <div className="proposal--container">
        <span>
          <h3> Objet de la mission </h3>
          <input onChange={this.handleTextChange} type="text" name="subject" />
          <h3> Début de la mission </h3>
          <input onChange={this.handleRadioChange} type="radio" name="start" value={"asap"} />
          <input onChange={this.handleRadioChange} type="radio" name="start" value={"next-week"} />
          <input onChange={this.handleRadioChange} type="radio" name="start" value={"next-month"} />
          <input onChange={this.handleRadioChange} type="radio" name="start" value={"idk"} />
          <h3> Durée de la mission </h3>
          <input onChange={this.handleRadioChange} type="radio" name="duration" value={"<1week"} />
          <input onChange={this.handleRadioChange} type="radio" name="duration" value={"<1month"} />
          <input onChange={this.handleRadioChange} type="radio" name="duration" value={"btw1and3"} />
          <input onChange={this.handleRadioChange} type="radio" name="duration" value={"btw3and6"} />
          <input onChange={this.handleRadioChange} type="radio" name="duration" value={">6month"} />
          <input onChange={this.handleRadioChange} type="radio" name="duration" value={"idk"} />
          <h3> Localisation de la mission </h3>
          <input onChange={this.handleCheckboxChange} type="checkbox" name="loc" />
          <h3> Description de la mission </h3>
          <input onChange={this.handleTextChange} type="textarea" name="description" />
          <h3> Compétences souhaitées </h3>
          <h3> Langues </h3>
          <h3> Ajouter un fichier </h3>
          <button type="submit" onClick={this.handleSubmitProject}> Confirmer </button>
        </span>
        <span> tototototo</span>
      </div>
    );
  }

  handleSelectChange(event) {
    this.setState({ type: event.target.value });
  }

  renderClientForm() {
    return (
      <span>
        <h3> Nom de la société </h3>
        <input type="text" name="name" onChange={this.handleTextChange} />
        <h3> Pays </h3>
        <input type="text" name="country" onChange={this.handleTextChange} />
        <h3> Ville </h3>
        <input type="text" name="city" onChange={this.handleTextChange} />
        <h3> Catégorie </h3>
        <select value={this.state.clientType} onChange={this.handleSelectChange}>
          <option value="">-</option>
          <option value="Achats"> Achats </option>
          <option value="Administration"> Administration </option>
          <option value="Commercial / Sales"> Commercial / Sales </option>
          <option value="Direction / Management"> Direction / Management </option>
          <option value="Finance / Comptabilisé"> Finance / Comptabilisé </option>
          <option value="IT / DSI"> IT / DSI </option>
          <option value="Marketing / Communication"> Marketing / Communication </option>
          <option value="Operations"> Operations </option>
          <option value="Produits"> Produits </option>
          <option value="Ressources humaines"> Ressources humaines </option>
        </select>
        <h3> Téléphone </h3>
        <input type="text" name="phone" onChange={this.handleTextChange} />
        <button type="submit" onClick={this.handleSubmitClient}> Confirmer </button>
      </span>

    );
  }

  render() {
    return (
      <>
        <div className="proposal--page">
          <Navbar {...this.props} />
          <div className="proposal--title">
            <h2> Proposition du projet </h2>
            <p> Pour vous adresser un devis, les freelances sélectionnés ont besoin de connaître les contours et conditions de la mission. Ces informations seront conservées pour contacter d&apos;autres freelances.</p>
          </div>
          {this.state.step === 0 && this.renderProjectForm()}
          {this.state.step === 1 && <Login {...this.propos} nextStep={this.nextStep} />}
          {this.state.step === 2 && this.renderClientForm()}
          <Footer {...this.props} />
        </div>
      </>
    );
  }
}

Proposal.defaultProps = {
  history: {}
};

Proposal.propTypes = {
  history: PropTypes.object,
};

export default Proposal;