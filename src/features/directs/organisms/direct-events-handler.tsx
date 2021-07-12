import React, {useEffect} from "react";
import {useSelector} from "react-redux";

import {authSelectors} from "@features/auth";
import {useRootDispatch} from "@lib/store";
import {socket} from "@lib/socket";
import {DirectChatMessage, DirectChatPartner} from "../lib/typings";
import {serverEvents} from "../lib/socket-events";
import * as actions from "../actions";

export const DirectEventsHandler: React.FC = () => {
  const dispatch = useRootDispatch();

  const credentials = useSelector(authSelectors.credentials)!;

  useEffect(() => {
    socket.on(serverEvents.MESSAGE, ({message, partner}: {message: DirectChatMessage; partner: DirectChatPartner}) => {
      const isOwn = (message.sender && message.sender.id) === credentials.id;

      if (!isOwn) dispatch(actions.addMessage({
        message, isOwn: false,
        partnerId: partner.id
      }));
    });

    socket.on(serverEvents.MESSAGE_READ, ({message, partner}: {message: DirectChatMessage; partner: DirectChatPartner}) => {
      dispatch(actions.readMessage({
        partnerId: partner.id,
        messageId: message.id
      }));
    });

    return () => {
      socket.off(serverEvents.MESSAGE);
      socket.off(serverEvents.MESSAGE_READ);
    };
  }, []);

  return null;
}