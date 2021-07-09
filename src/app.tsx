import React from "react";

import {CredentialsLoader} from "@features/auth";
import {WebsocketHandler} from "@lib/websocket";
import {Routes} from "@pages/routes";
import {GlobalStyles} from "./global-styles";

export const App = () => (
  <CredentialsLoader>
    <WebsocketHandler>
      <Routes/>
      <GlobalStyles/>
    </WebsocketHandler>
  </CredentialsLoader>
);