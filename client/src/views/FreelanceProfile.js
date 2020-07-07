import React from 'react';
import Navbar from '../components/Navbar/Navy';
import Footer from '../components/Footer/Footer';
import Profile from '../components/Freelance/Profile';
import { parseQuery } from '../utils/utils';

class Freelance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: null,
      favorite: false,
      connection: ''
    };
    this.query = parseQuery(window.location.search)
    this.fetchGetProfil = this.fetchGetProfil.bind(this);
    this.fetchGetFavorite = this.fetchGetFavorite.bind(this);
    this.updateLogin = this.updateLogin.bind(this);
  }

  async fetchGetFavorite(url, data) {
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

  async fetchGetProfil(url, data = this.query) {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    let res = await response.json();
    return res;
  }

  componentDidMount() {
    this.fetchGetProfil('/api/freelance/getProfil')
      .then(res => {
        if (res.profile) {
          this.setState({ profile: res.profile })
          this.fetchGetFavorite(
            '/api/user/getFavorite',
            res.profile
          )
            .then(res => {
              this.setState({ favorite: res.favorite });
            })
        }
      })
      .catch(err => console.log(err.message));
  }

  updateLogin(connection) {
    this.setState({ connection });
  }
  render() {
    var { profile, favorite } = this.state;
    return (
      <>
        <Navbar {...this.props} updateLogin={this.updateLogin} connection={this.state.connection} />
        {profile && <Profile {...this.props} updateLogin={this.updateLogin} user={profile} favorite={favorite} />}
        <Footer {...this.props} />
      </>
    );
  }
}

export default Freelance;