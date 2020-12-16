import React from "react";
import {Normalize} from "styled-normalize";

import {Routes} from "@pages/routes";
import {ThemeToggleProvider} from "@features/theming";
import {CredentialsLoader} from "@features/auth";
import {GlobalStyles} from "./global-styles";

export const App: React.FC = () => (
  <ThemeToggleProvider>
    <GlobalStyles/>
    <Normalize/>
    <CredentialsLoader>
      <Routes/>
    </CredentialsLoader>
  </ThemeToggleProvider>
);