import React, {useEffect} from "react";
import {useSelector} from "react-redux";

import {authSelectors} from "@features/auth";
import {useRootDispatch} from "@lib/store";
import {socket} from "@lib/socket";
import {GroupChatDetails, GroupChatMessage} from "../lib/typings";
import {serverEvents} from "../lib/socket-events";
import * as actions from "../actions";

export const GroupEventsHandler: React.FC = () => {
  const dispatch = useRootDispatch();

  const credentials = useSelector(authSelectors.credentials)!;

  useEffect(() => {
    socket.on(serverEvents.MESSAGE, ({message, chat}: {message: GroupChatMessage; chat: GroupChatDetails}) => {
      const isOwn = (message.sender && message.sender.id) === credentials.id;

      if (!isOwn) dispatch(actions.addMessage({
        message, isOwn: false,
        groupId: chat.id
      }));
    });

    socket.on(serverEvents.MESSAGE_READ, ({message, chat}: {message: GroupChatMessage; chat: GroupChatDetails}) => {
      dispatch(actions.readMessage({
        groupId: chat.id,
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