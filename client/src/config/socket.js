import openSocket from 'socket.io-client';

const ENDPOINT = "http://localhost:8080";

const socket = openSocket(ENDPOINT);

export default socket;