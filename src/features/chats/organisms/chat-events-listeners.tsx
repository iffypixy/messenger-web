import React, {ReactElement, useEffect} from "react";

import {DirectChatMessage, DirectChatPartner, directsActions} from "@features/directs";
import {socket} from "@lib/websockets";
import {useRootDispatch} from "@lib/store";

export const ChatEventsListeners: React.FC = ({children}) => {
  const dispatch = useRootDispatch();

  useEffect(() => {
    socket.on("DIRECT_CHAT:MESSAGE", ({message, partner}: {message: DirectChatMessage; partner: DirectChatPartner}) => {
      dispatch(directsActions.addMessage({
        partnerId: partner.id, message
      }));
    });
  }, []);

  return children as ReactElement;
};