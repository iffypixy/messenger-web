import React, {useEffect} from "react";
import io from "socket.io-client";
import {useSelector} from "react-redux";

import {authSelectors} from "@features/auth";
import {BACKEND_URL} from "@lib/constants";
import {useActions} from "@lib/hooks";
import {chatDialogsActions} from "@features/chat/features/dialogs";
import {IMessage} from "@api/common";

export const socket = io(BACKEND_URL);

interface Props {
  children: React.ReactElement;
}

let typingTimeout: number | null = null;

export const SocketInit: React.FC<Props> = ({children}) => {
  const credentials = useSelector(authSelectors.credentialsSelector);
  const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);

  const {addCompanionMessage, setMessagesRead, setTypingStatus} = useActions(chatDialogsActions);

  useEffect(() => {
    if (isAuthenticated) {
      socket.emit("credentials", {userId: credentials!.id});

      socket.on("message", ({message}: {message: IMessage}) =>
        addCompanionMessage(message)
      );

      socket.on("read-messages", ({ids, companionId}: {ids: string[]; companionId: string}) =>
        setMessagesRead({companionId, ids})
      );

      socket.on("typing", ({companionId}: {companionId: string}) => {
        if (typingTimeout) clearTimeout(typingTimeout);

        setTypingStatus({companionId, typing: true});

        typingTimeout = setTimeout(() => {
          setTypingStatus({companionId, typing: false});
        }, 1000);
      });
    }
  }, [isAuthenticated]);

  return children;
};