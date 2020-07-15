import openSocket from 'socket.io-client';

/**
 * Endpoint for socket, to emit values to the server.
 */
const ENDPOINT = "https://ginho.herokuapp.com/";
// const ENDPOINT = "http://localhost:8080";

const socket = openSocket(ENDPOINT);

export default socket;