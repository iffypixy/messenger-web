import React from "react";

import {CredentialsLoader} from "@features/auth";
import {DirectEventsHandler} from "@features/directs";
import {GroupEventsHandler} from "@features/groups";
import {AuthGuard} from "@lib/guards";
import {SocketInitialization} from "@lib/socket";
import {Routes} from "@pages/routes";
import {GlobalStyles} from "./global-styles";

export const App = () => (
  <CredentialsLoader>
    <AuthGuard>
      <SocketInitialization/>
      <DirectEventsHandler/>
      <GroupEventsHandler/>
    </AuthGuard>

    <Routes/>
    <GlobalStyles/>
  </CredentialsLoader>
);