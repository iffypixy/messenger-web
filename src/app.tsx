import React from "react";

import {Routes} from "@pages/routes";
import {GlobalStyles} from "./global-styles";
import {CredentialsLoader} from "@features/auth";
import {ChatEventsListeners} from "@features/chats";

export const App = () => (
  <CredentialsLoader>
    <ChatEventsListeners>
      <Routes/>
      <GlobalStyles/>
    </ChatEventsListeners>
  </CredentialsLoader>
);