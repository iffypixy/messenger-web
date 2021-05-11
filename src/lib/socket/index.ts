import React, {useEffect} from "react";
import io from "socket.io-client";
import {useSelector} from "react-redux";

import {authSelectors} from "@features/auth";
import {BACKEND_URL} from "@lib/constants";
import {useActions} from "@lib/hooks";
import {chatDialogsActions} from "@features/chat/features/dialogs";
import {ID, Message} from "@api/common";
import {userActions} from "@features/user";

export const events = {
  auth: {
    CREDENTIALS: "AUTH:CREDENTIALS"
  },

  users: {
    GET_ONLINE_USERS: "USERS:GET_ONLINE_USERS"
  },

  profile: {
    ONLINE: "PROFILE:ONLINE",
    OFFLINE: "PROFILE:OFFLINE"
  },

  dialogs: {
    READ_MESSAGES: "DIALOGS:READ-MESSAGES",
    CREATE_MESSAGE: "DIALOGS:CREATE-MESSAGE",
    TYPING: "DIALOGS:TYPING"
  }
};

//ts-ignore
export const socket = io(BACKEND_URL, {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjgwZTE5ZC04NjJjLTRhYTEtODU4OC01YjUxZTYyM2VkN2MiLCJpYXQiOjE2MTcxNzAwODYsImV4cCI6MTYxODk3MDA4Nn0.0Z4Nvs8Acxs4WexYus7zVsvvVrHcG1oU1dTDRmNvYds"
  }
});

socket.connect();

console.log(socket);

socket.emit("MESSAGE_SENDING", {chatId: "sdfsdf"});

interface Props {
  children: React.ReactElement;
}

let typingTimeout: number | null = null;

export const SocketInit: React.FC<Props> = ({children}) => {
  const credentials = useSelector(authSelectors.credentialsSelector)!;
  const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);

  const {
    addMessage,
    setMessagesRead,
    updateCompanion,
    setOnlineUsersIds
  } = useActions({...chatDialogsActions, ...userActions});

  useEffect(() => {
    if (isAuthenticated) {
      socket.emit(events.auth.CREDENTIALS, {userId: credentials.id});

      socket.emit(
        events.users.GET_ONLINE_USERS,
        null,
        ({usersIds}: {usersIds: ID[]}) => {
          setOnlineUsersIds({usersIds});
        }
      );

      socket.on(
        events.dialogs.CREATE_MESSAGE,
        ({message}: {message: Message}) =>
          addMessage({message, companionId: message.sender.id, own: false})
      );

      socket.on(
        events.dialogs.READ_MESSAGES,
        ({messagesIds, companionId}: {messagesIds: ID[]; companionId: ID}) =>
          setMessagesRead({companionId, messagesIds})
      );

      socket.on(
        events.dialogs.TYPING,
        ({companionId, status}: {companionId: ID; status: string}) => {
          if (typingTimeout) clearTimeout(typingTimeout);

          updateCompanion({companionId, companion: {status}});

          typingTimeout = setTimeout(() => {
            updateCompanion({companionId, companion: {status: null}});
          }, 1000);
        }
      );

      socket.on(events.profile.ONLINE, ({usersIds}: {usersIds: ID[]}) => {
        setOnlineUsersIds({usersIds});
      });

      socket.on(events.profile.OFFLINE, ({usersIds}: {usersIds: ID[]}) => {
        setOnlineUsersIds({usersIds});
      });
    }
  }, [isAuthenticated]);

  return children;
};
