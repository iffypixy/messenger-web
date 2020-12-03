import {DefaultTheme} from "styled-components";

import {commonTheme} from "./common-theme";

export const lightTheme: DefaultTheme = {
  ...commonTheme,
  palette: {
    primary: {
      light: "",
      main: "#2F334D",
      dark: "#292C43",
      contrastText: ""
    },
    secondary: {
      light: "",
      main: "#476EEF",
      dark: "",
      contrastText: ""
    },
    error: {
      light: "",
      main: "#F44336",
      dark: "",
      contrastText: ""
    },
    warning: {
      light: "#F84469",
      main: "",
      dark: "",
      contrastText: ""
    },
    info: {
      light: "",
      main: "",
      dark: "",
      contrastText: ""
    },
    success: {
      light: "",
      main: "",
      dark: "",
      contrastText: ""
    },
    text: {
      primary: "#FEFEFE",
      secondary: "#52566E"
    },
    background: {
      paper: "#E9E9E9",
      default: "#F0F0F0"
    },
    action: {
      hover: "rgba(0, 0, 0, 0.04)",
      disabled: "rgba(0, 0, 0, 0.26)",
      focus: "rgba(0, 0, 0, 0.12)",
    }
  }
};