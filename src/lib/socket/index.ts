import React, {useEffect} from "react";
import io from "socket.io-client";
import {useSelector} from "react-redux";

import {authSelectors} from "@features/auth";
import {BACKEND_URL} from "@lib/constants";
import {useActions} from "@lib/hooks";
import {chatDialogsActions} from "@features/chat/features/dialogs";
import {Message} from "@api/dialog.api";

export const socket = io(`${BACKEND_URL}`, {reconnection: true});

interface Props {
    children: React.ReactElement;
}

export const SocketInit: React.FC<Props> = ({children}) => {
  const credentials = useSelector(authSelectors.credentialsSelector);
  const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);
  const {addCompanionMessage} = useActions(chatDialogsActions);

  useEffect(() => {
    if (isAuthenticated) {
      socket.emit("credentials", {userId: credentials!.id});

      socket.on("message", ({message}: {message: Message}) => addCompanionMessage(message));
    }
  }, [isAuthenticated]);

  return children;
};
