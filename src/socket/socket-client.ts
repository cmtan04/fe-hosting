import { io, type Socket } from "socket.io-client";

const resolveSocketUrl = () => {
  const explicitUrl = process.env.REACT_APP_SOCKET_URL;
  if (explicitUrl) {
    return explicitUrl;
  }

  const apiUrl = process.env.REACT_APP_API_URL ?? "http://localhost:8000/";
  return apiUrl.replace(/\/$/, "");
};

let socketInstance: Socket | null = null;

export const getSocketClient = () => {
  if (socketInstance) {
    return socketInstance;
  }

  socketInstance = io(resolveSocketUrl(), {
    autoConnect: false,
    transports: ["websocket", "polling"],
    auth: {
      token: localStorage.getItem("token")
        ? `Bearer ${localStorage.getItem("token")}`
        : undefined,
    },
  });

  socketInstance.on("reconnect_attempt", () => {
    socketInstance?.auth &&
      (socketInstance.auth = {
        ...socketInstance.auth,
        token: localStorage.getItem("token")
          ? `Bearer ${localStorage.getItem("token")}`
          : undefined,
      });
  });

  return socketInstance;
};
