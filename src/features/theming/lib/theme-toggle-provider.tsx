import React from "react";
import {ThemeProvider} from "styled-components";
import {useSelector} from "react-redux";

import {darkTheme, lightTheme} from "./themes";
import * as selectors from "../selectors";

export const ThemeToggleProvider: React.FC = ({children}) => {
  const theme = useSelector(selectors.themeSelector);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      {children}
    </ThemeProvider>
  );
};