import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:5000", {
  transports: ["websocket"],
  upgrade: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  timeout: 5000,
});

socket.on("connect", () => {
  console.log("Connected to Flask backend");
});

socket.on("disconnect", () => {
  console.log("Disconnected from Flask backend");
});

export default socket;
