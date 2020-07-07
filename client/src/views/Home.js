import React from 'react';
import PropTypes from 'prop-types';
import Navy from './../components/Navbar/Navbar';
import auth from '../utils/auth';
import io from 'socket.io-client';

let socket;
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      key: ''
    };

    this.handleCreateLobby = this.handleCreateLobby.bind(this);
    this.handleChangeKey = this.handleChangeKey.bind(this);
  }

  async fetchCreateLobby(url) {
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

  handleChangeKey(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    })
  }

  createLobby({ status, data }) {
    if (status !== 200)
      return;
    this.props.history.push(
      `/lobby?key=${data.secretKey}&created=1`
    );
  }

  handleCreateLobby() {
    if (!auth.isLogin())
      return;

    this.fetchCreateLobby('/api/lobby/create')
      .then(res => {
        console.log(res);
        this.createLobby(res)
      });
  }

  render() {
    return (
      <>
        <Navy {...this.props} />
        <button onClick={this.handleCreateLobby}> Créer un salon </button>
        <form action={`/lobby?key=${this.state.key}`}>
          <input
            type="password"
            name="key"
            autoComplete="on"
            value={this.state.key}
            onChange={this.handleChangeKey}
          />
          <input
            type="submit"
            /* onClick={this.handleJoinLobby} */
            value="Rejoindre un salon"
          />
        </form>
      </>
    );
  }
}

Home.defaultProps = {
  history: {}
};

Home.propTypes = {
  history: PropTypes.object
};

export default Home;
