import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './../components/Navbar/Navy';
import Footer from './../components/Footer/Footer';
import FreelanceSelect from './../components/User/FreelanceSelect';
import freelanceSelection from './../utils/freelanceSelection';
import { parseQuery, addQuery } from './../utils/utils';


class Search extends React.Component {
  constructor(props) {
    super(props);

    const query = parseQuery(window.location.search);
    for (let d in query) {
      if (d === 'loc' || d === 'cat' || d === 'q') {
        query[d] = query[d].split(',');
      } else {
        query[d] = query[d].toString();
      }
    }

    this.state = {
      users: null,
      rangeRate: [0, 4],
      query: query,
      connection: '',
      filterVisible: true
    };

    this.fetchSearchFreelance = this.fetchSearchFreelance.bind(this);
    this.handleCard = this.handleCard.bind(this);
    this.renderCards = this.renderCards.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRangeRate = this.handleRangeRate.bind(this);
  }

  async fetchSearchFreelance(url, data) {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    });
    let res = await response.json();
    return res;
  }

  handleCard(user) {
    const query = `${window.location.search}&id=${user.id}`
    this.props.history.push(
      `/freelance/${user.firstName}${user.lastName.toUpperCase()}${query}`
    );
  }

  handleRangeRate(rangeRate) {
    this.setState({ rangeRate });
  }

  renderCards() {
    const { users } = this.state;
    if (users == null) {
      return null;
    }
    return (
      <div className="cards">
        {users.map((user) =>
          <>
            <div key={user.email} className="card" onClick={() => this.handleCard(user)}>
              <div className="card__image-container">
                <img src={require("./../assets/img/hero.png")} alt='hero'></img>
              </div>
              <div className="card__content">
                <p className="card__title text--medium">
                  {user.firstName} {user.lastName.toUpperCase()}
                </p>
                <div className="card__info">
                  <span className="card__language"> Python </span>
                  <span className="card__language"> Java </span>
                  <span className="card__language"> C++ </span>
                  <span className="card__language"> Javascript </span>
                </div>
              </div>
            </div>

            <div key={user.email} className="card" onClick={() => this.handleCard(user)}>
              <div className="card__image-container">
                <img src={require("./../assets/img/hero.png")} alt='hero'></img>
              </div>
              <div className="card__content">
                <p className="card__title text--medium">
                  {user.firstName} {user.lastName.toUpperCase()}
                </p>
                <div className="card__info">
                  <span className="card__language"> Python </span>
                  <span className="card__language"> Java </span>
                  <span className="card__language"> C++ </span>
                  <span className="card__language"> Javascript </span>
                </div>
              </div>
            </div>

            <div key={user.email} className="card" onClick={() => this.handleCard(user)}>
              <div className="card__image-container">
                <img src={require("./../assets/img/hero.png")} alt='hero'></img>
              </div>
              <div className="card__content">
                <p className="card__title text--medium">
                  {user.firstName} {user.lastName.toUpperCase()}
                </p>
                <div className="card__info">
                  <span className="card__language"> Python </span>
                  <span className="card__language"> Java </span>
                  <span className="card__language"> C++ </span>
                  <span className="card__language"> Javascript </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  componentDidMount() {
    const { query } = this.state;
    if (query.cat && query.q)
      this.fetchSearchFreelance('/api/freelance/search', query)
        .then(res => {
          this.setState({ users: res.users });
        })
        .catch(err => console.log(err.message));
  }

  handleCheckBoxChange(e) {
    const { query } = this.state
    switch (e.target.name) {
      case 'available':
        query.available = e.target.checked;
        break;
      case 'availableMonth':
        query.availableMonth = e.target.checked;
        if (e.target.checked === false) {
          delete query.month;
        } else if (!query.month) {
          query.month = 3;
        }
        break;
      case 'amazed':
        query.amazed = e.target.checked;
        break;
      case 'esn':
        query.esn = e.target.checked;
        break;
      default:
        break;
    }

    for (let q in query) {
      if (query[q] === false || !query[q]) {
        delete query[q];
      }
    }

    this.setState({ query });
    window.location.href = addQuery(window, query);
  }

  handleInputChange(v) {
    const { query } = this.state;
    query.month = v;
    this.setState({ query });
    if (query.availableMonth === 'true')
      window.location.href = addQuery(window, query);
  }

  render() {
    const { query } = this.state;
    query.q = query.q || [];
    query.cat = query.cat || [];
    return (
      <>
        <Navbar {...this.props} />
        <div className="cd-main-content">
          <div className="filter-is-visible cd-filter">
            <form>
              <div className="cd-filter-block">
                <h4>Mots clefs</h4>
              </div>
              <div className="cd-filter-block">
                <h4> Disponibilité </h4>

                <ul className="cd-filter-content cd-filters list">
                  <li>
                    <input
                      type="checkbox"
                      className="filter"
                      data-filter=".check-available"
                      id="checkbox-available"
                      name="available"
                      onChange={this.handleCheckBoxChange}
                      checked={query.available === 'true'}
                    /> &nbsp;
                    <label
                      className="checkbox-label"
                      htmlFor="checkbox-available"
                    > Immédiate </label>
                  </li>

                  <li>
                    <input
                      type="checkbox"
                      className="filter"
                      data-filter=".check-availableMonth"
                      id="chekbox-availableMonth"
                      name="availableMonth"
                      onChange={this.handleCheckBoxChange}
                      checked={query.availableMonth === 'true'}
                    />
                    <label
                      className="checkbox-label"
                      htmlFor="checbkox-availableMonth"
                    >Disponible dans
                      mois
                    </label>
                  </li>
                </ul>
              </div>

              <div className="cd-filter-block">
                <h4> Profil </h4>
                <ul className="cd-filter-content cd-filters list">
                  <li>
                    <input
                      className="filter"
                      data-filter=".check-amazed"
                      id="checkbox-amazed"
                      type="checkbox"
                      name="amazed"
                      onChange={this.handleCheckBoxChange}
                      checked={query.amazed === 'true'}
                    />
                    <label
                      className="checkbox-label"
                      htmlFor="checkbox-amazed"
                    > Vérifié par AMAZED </label>
                  </li>
                  <li>
                    <input
                      className="filter"
                      data-filter=".check-esn"
                      id="checkbox-esn"
                      type="checkbox"
                      name="esn"
                      onChange={this.handleCheckBoxChange}
                      checked={query.esn === 'true'}

                    />
                    <label
                      className="checkbox-label"
                      htmlFor="checkbox-esn"
                    > Proposé par ESN</label>
                  </li>
                </ul>
              </div>
            </form>
          </div>
          <div className="cd-cards">
            {!freelanceSelection.isEmpty() &&
              <FreelanceSelect {...this.props} selection={freelanceSelection.get()} />
            }
            <div className="search--cards-container">
              {this.renderCards()}
            </div>
          </div>
        </div>
        <Footer {...this.props} />
      </>
    );
  }
}

Search.defaultProps = {
  history: {}
};

Search.propTypes = {
  history: PropTypes.object,
};

export default Search;