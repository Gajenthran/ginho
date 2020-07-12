import openSocket from 'socket.io-client';

// const ENDPOINT = "http://localhost:8080";
const ENDPOINT = "https://protected-reef-22377.herokuapp.com/";

const socket = openSocket(ENDPOINT);

export default socket;