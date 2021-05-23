import React from "react";

import {Routes} from "@pages/routes";
import {GlobalStyles} from "./global-styles";
import {CredentialsLoader} from "@features/auth";

export const App = () => (
  <CredentialsLoader>
    <Routes/>
    <GlobalStyles/>
  </CredentialsLoader>
);