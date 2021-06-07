import React, {ReactElement, useEffect} from "react";

import {directsActions} from "@features/directs";
import {socket} from "@lib/websockets";
import {useRootDispatch} from "@lib/store";

export const ChatsListeners: React.FC = ({children}) => {
  const dispatch = useRootDispatch();

  useEffect(() => {
    socket.on("DIRECT_CHAT:MESSAGE", (message) => {
      dispatch(directsActions.addMessage({
        message, chatId: message.chat.id
      }));
    });
  }, []);

  return children as ReactElement;
};