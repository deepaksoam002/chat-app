import {io} from 'socket.io-client';

const SOCKET_URL = "http://localhost:8002";

export const socket = io(SOCKET_URL, {
    withCredentials:true,
    transports:["websocket"],
    autoConnect:false,
});