import React from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar/Navy';
import Footer from '../components/Footer/Footer';

class ConfirmSignup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favorites: []
    }

    this._isMounted = false;
    this.fetchGetFavorites = this.fetchGetFavorites.bind(this);
    this.handleCard = this.handleCard.bind(this);
    this.renderFavorites = this.renderFavorites.bind(this);
  }

  async fetchGetFavorites(url, data) {
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

  componentDidMount() {
    this._isMounted = true;
    this.fetchGetFavorites('/api/user/getFavorites')
      .then(res => {
        this.setState({ favorites: res.favorites })
      })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleCard(user) {
    this.props.history.push(
      `/freelance/${user.firstName}${user.lastName.toUpperCase()}?id=${user.id}`
    );
  }

  renderFavorites() {
    return (
      <div className="cards">
        {this.state.favorites.map(f =>
          <div key={f.email} className="card" onClick={() => this.handleCard(f)}>
            <div className="card__image-container">
              <img src={require("./../assets/img/hero.png")} alt='hero'></img>
            </div>
            <div className="card__content">
              <p className="card__title text--medium">
                {f.firstName} {f.lastName.toUpperCase()}
              </p>
              <div className="card__info">
                <span className="card__language"> Python </span>
                <span className="card__language"> Java </span>
                <span className="card__language"> C++ </span>
                <span className="card__language"> Javascript </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  render() {
    return (
      <>
        <div className="favorites--page">
          <Navbar {...this.props} />
          <div className="favorites--container">
            <h3> Mes favoris </h3>
            {this.renderFavorites()}
          </div>
          <Footer {...this.props} />
        </div>
      </>
    );
  }
}

ConfirmSignup.defaultProps = {
  history: {}
};

ConfirmSignup.propTypes = {
  history: PropTypes.object,
};

export default ConfirmSignup;