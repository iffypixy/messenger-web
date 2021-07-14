import React, {useEffect} from "react";

import {useRootDispatch} from "@lib/store";
import {socket} from "@lib/socket";
import {GroupDetails, GroupMember, GroupMessage} from "../lib/typings";
import {serverEvents} from "../lib/socket-events";
import * as actions from "../actions";

export const GroupEventsHandler: React.FC = () => {
  const dispatch = useRootDispatch();

  useEffect(() => {
    socket.on(serverEvents.MESSAGE, ({message, details}: {
      message: GroupMessage;
      details: GroupDetails;
    }) => {
      dispatch(actions.addMessage({
        message,
        groupId: details.id,
        isOwn: false
      }));
    });

    socket.on(serverEvents.MESSAGE_READ, ({message, chat}: {
      message: GroupMessage;
      chat: GroupDetails;
    }) => {
      dispatch(actions.readMessage({
        groupId: chat.id,
        messageId: message.id
      }));
    });

    socket.on(serverEvents.CHAT_CREATED, ({details, member, participants}: {
      details: GroupDetails;
      member: GroupMember;
      participants: number;
    }) => {
      dispatch(actions.addChat({
        group: {
          ...details,
          member, participants
        }
      }));
    });

    socket.on(serverEvents.MEMBER_ADDED, ({details}: {
      details: GroupDetails;
    }) => {
      dispatch(actions.increaseParticipants({
        groupId: details.id
      }));
    });

    socket.on(serverEvents.MEMBER_KICKED, ({details}: {
      details: GroupDetails;
    }) => {
      dispatch(actions.decreaseParticipants({
        groupId: details.id
      }));
    });

    socket.on(serverEvents.MEMBER_LEFT, ({details}: {
      details: GroupDetails;
    }) => {
      dispatch(actions.decreaseParticipants({
        groupId: details.id
      }));
    });

    socket.on(serverEvents.ADDED, ({details, participants, member}: {
      details: GroupDetails;
      member: GroupMember;
      participants: number;
    }) => {
      dispatch(actions.addChat({
        group: {
          ...details,
          member, participants
        }
      }));
    });

    socket.on(serverEvents.KICKED, ({details}: {
      details: GroupDetails;
    }) => {
      dispatch(actions.removeChat({
        groupId: details.id
      }));
    });

    socket.on(serverEvents.OWNER_REPLACEMENT, ({details, member}: {
      details: GroupDetails;
      member: GroupMember;
    }) => {
      dispatch(actions.changeMember({
        groupId: details.id, member
      }));
    });

    return () => {
      socket.off(serverEvents.MESSAGE);
      socket.off(serverEvents.MESSAGE_READ);
      socket.off(serverEvents.ADDED);
      socket.off(serverEvents.KICKED);
      socket.off(serverEvents.MEMBER_ADDED);
      socket.off(serverEvents.MEMBER_KICKED);
      socket.off(serverEvents.MEMBER_LEFT);
      socket.off(serverEvents.CHAT_CREATED);
      socket.off(serverEvents.OWNER_REPLACEMENT);
    };
  }, []);

  return null;
};