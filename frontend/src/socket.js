// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:5000", {
  transports: ["websocket"],
  autoConnect: false, // ⚠️ prevent auto-connect until we're ready
});

export default socket;
