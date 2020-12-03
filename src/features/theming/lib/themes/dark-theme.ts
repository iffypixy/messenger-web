import {DefaultTheme} from "styled-components";

import {commonTheme} from "./common-theme";

export const darkTheme: DefaultTheme = {
  ...commonTheme,
  palette: {
    primary: {
      light: "",
      main: "#2F334D",
      dark: "#292C43"
    },
    secondary: {
      light: "#476EEF",
      main: "#10213E",
      dark: "#1B3A5F",
      contrastText: ""
    },
    error: {
      light: "",
      main: "#F44336",
      dark: "",
      contrastText: ""
    },
    warning: {
      light: "",
      main: "#F84469",
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
      primary: "rgb(250, 250, 250)",
      secondary: "#52566E"
    },
    background: {
      paper: "#303030",
      default: "#212121"
    },
    action: {
      hover: "rgba(0, 0, 0, 0.04)",
      disabled: "rgba(0, 0, 0, 0.26)",
      focus: "rgba(0, 0, 0, 0.12)"
    }
  }
};