import React, {useEffect} from "react";
import io from "socket.io-client";
import {useSelector} from "react-redux";

import {authSelectors} from "@features/auth";
import {BACKEND_URL} from "@lib/constants";
import {useActions} from "@lib/hooks";
import {chatDialogsActions} from "@features/chat/features/dialogs";
import {ID, Message} from "@api/common";

export const events = {
  auth: {
    CREDENTIALS: "AUTH:CREDENTIALS"
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

export const socket = io(BACKEND_URL);

interface Props {
  children: React.ReactElement;
}

let typingTimeout: number | null = null;

export const SocketInit: React.FC<Props> = ({children}) => {
  const credentials = useSelector(authSelectors.credentialsSelector);
  const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);

  const {addCompanionMessage, setMessagesRead, setCompanionStatus, setCompanionOnlineStatus} = useActions(chatDialogsActions);

  useEffect(() => {
    if (isAuthenticated) {
      socket.emit(events.auth.CREDENTIALS, {userId: credentials!.id});

      socket.on(events.dialogs.CREATE_MESSAGE, ({message}: {message: Message}) =>
        addCompanionMessage({message})
      );

      socket.on(events.dialogs.READ_MESSAGES, ({messagesIds, companionId}: {messagesIds: ID[]; companionId: ID}) =>
        setMessagesRead({companionId, messagesIds})
      );

      socket.on(events.dialogs.TYPING, ({companionId, status}: {companionId: ID, status: string}) => {
        if (typingTimeout) clearTimeout(typingTimeout);

        setCompanionStatus({companionId, status});

        typingTimeout = setTimeout(() => {
          setCompanionStatus({companionId, status: null});
        }, 1000);
      });

      socket.on(events.profile.ONLINE, ({userId}: {userId: ID}) => {
        setCompanionOnlineStatus({companionId: userId, online: true});
      });

      socket.on(events.profile.OFFLINE, ({userId}: {userId: ID}) => {
        setCompanionOnlineStatus({companionId: userId, online: false});
      });
    }
  }, [isAuthenticated]);

  return children;
};
