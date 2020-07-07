import React from 'react';
import PropTypes from 'prop-types';
import Navy from './../components/Navbar/Navbar';
import auth from '../utils/auth';
import io from 'socket.io-client';
import qs from 'query-string';

let socket;

class Lobby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleJoinLobby = this.handleJoinLobby.bind(this);
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

  async fetchJoinLobby(url, secretKey) {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('login')}`
      },
      body: JSON.stringify({ secretKey })
    });
    let res = await response.json();
    return res;
  }

  createLobby({ status, data }) {
    if (status !== 200)
      return;

    socket = io('localhost:8080');
    const { email, firstName, secretKey } = data;
    socket.emit('new-player', {
      email,
      firstName,
      secretKey,
      admin: 1
    });

    console.log('createLobby');
    socket.on('room-users', ({ secretKey, users }) => {
      console.log(secretKey, users);
    });
  }

  handleCreateLobby(secretKey) {
    if (!auth.isLogin())
      return;

    this.fetchCreateLobby('/api/lobby/create')
      .then(res => {
        res.data['secretKey'] = secretKey;
        console.log(res);
        this.createLobby(res)
      });
  }

  joinLobby({ status, lobby, secretKey, user }) {
    if (status !== 200)
      return;

    socket = io('localhost:8080');

    const { email, firstName } = user;
    socket.emit('new-player', {
      email,
      firstName,
      secretKey,
      admin: 0
    });

    console.log('joinLobby');
    socket.on('room-users', ({ secretKey, users }) => {
      console.log(secretKey, users);
    });
    socket.on('message', message => {
      console.log(message);
    });
  }

  handleJoinLobby(secretKey) {
    if (!auth.isLogin())
      return;

    this.fetchJoinLobby('/api/lobby/join', secretKey)
      .then(res => {
        res['secretKey'] = secretKey;
        console.log(res);
        this.joinLobby(res);
      });
  }

  componentDidMount() {
    const query = qs.parse(this.props.location.search);
    if (/* Object.propotype.hasOwnProperty.call(query, 'created') && */ query['created'] === '1') {
      this.handleCreateLobby(query.key);
    } else {
      this.handleJoinLobby(query.key);
    }

    /* socket = io('localhost:8080');
    console.log('room-users');
    socket.on('room-users', ({ room, users }) => {
      console.log(room, users);
    }); */
  }

  render() {
    return (
      <>
        <Navy {...this.props} />
        Lobby
      </>
    );
  }
}

Lobby.defaultProps = {
  history: {},
  location: {}
};

Lobby.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
};

export default Lobby;
