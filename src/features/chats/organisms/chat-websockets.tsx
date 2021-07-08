import React, {ReactElement, useEffect} from "react";
import {useSelector} from "react-redux";

import {authSelectors} from "@features/auth";
import {DirectChatMessage, DirectChatPartner, directsActions} from "@features/directs";
import {groupsActions, GroupChatMessage, GroupChatDetails} from "@features/groups";
import {socket} from "@lib/websockets";
import {useRootDispatch} from "@lib/store";

export const ChatWebsockets: React.FC = ({children}) => {
  const dispatch = useRootDispatch();

  const credentials = useSelector(authSelectors.credentials);

  useEffect(() => {
    if (!!credentials) {
      socket.on("DIRECT_CHAT:MESSAGE", ({message, partner}: {message: DirectChatMessage; partner: DirectChatPartner}) => {
        dispatch(directsActions.addMessage({
          message, isOwn: false,
          partnerId: partner.id
        }));
      });

      socket.on("GROUP_CHAT:MESSAGE", ({message, chat}: {message: GroupChatMessage; chat: GroupChatDetails}) => {
        const isOwn = (message.sender && message.sender.id) === credentials.id;

        if (!isOwn) {
          dispatch(groupsActions.addMessage({
            message, isOwn: false,
            groupId: chat.id
          }));
        }
      });

      socket.on("DIRECT_CHAT:MESSAGE_READ", ({message, partner}: {message: DirectChatMessage; partner: DirectChatPartner}) => {
        dispatch(directsActions.readMessage({
          partnerId: partner.id,
          messageId: message.id
        }));
      });

      socket.on("GROUP_CHAT:MESSAGE_READ", ({message, chat}: {message: GroupChatMessage; chat: GroupChatDetails}) => {
        dispatch(groupsActions.readMessage({
          groupId: chat.id,
          messageId: message.id
        }));
      });
    }
  }, []);

  return children as ReactElement;
};