import React, {useEffect} from "react";

import {socket} from "./socket";

export const SocketInitialization: React.FC = () => {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
};