import React, {useEffect} from "react";

import {useRootDispatch} from "@lib/store";
import {socket} from "@lib/socket";
import {DirectDetails, DirectMessage, DirectPartner} from "../lib/typings";
import {serverEvents} from "../lib/socket-events";
import * as actions from "../actions";

export const DirectEventsHandler: React.FC = () => {
  const dispatch = useRootDispatch();

  useEffect(() => {
    socket.on(serverEvents.MESSAGE, ({message, partner, details, isBanned}: {
      message: DirectMessage;
      partner: DirectPartner;
      details: DirectDetails;
      isBanned: boolean;
    }) => {
      dispatch(actions.addMessage({
        message,
        isOwn: false,
        partnerId: partner.id,
        chat: {details, partner, isBanned},
      }));
    });

    socket.on(serverEvents.MESSAGE_READ, ({message, partner}: {
      message: DirectMessage;
      partner: DirectPartner;
    }) => {
      dispatch(actions.setMessagesRead({
        partnerId: partner.id,
        messageId: message.id
      }));
    });

    socket.on(serverEvents.BANNED, ({details, partner}: {
      details: DirectDetails;
      partner: DirectPartner;
    }) => {
      dispatch(actions.setDirect({
        partnerId: partner.id,
        direct: {
          details, partner,
          isBanned: true
        }
      }));
    });

    socket.on(serverEvents.UNBANNED, ({details, partner}: {
      details: DirectDetails;
      partner: DirectPartner;
    }) => {
      dispatch(actions.setDirect({
        partnerId: partner.id,
        direct: {
          details, partner,
          isBanned: false
        }
      }));
    });

    return () => {
      socket.off(serverEvents.MESSAGE);
      socket.off(serverEvents.MESSAGE_READ);
      socket.off(serverEvents.BANNED);
      socket.off(serverEvents.UNBANNED);
    };
  }, []);

  return null;
}