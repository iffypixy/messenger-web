import {DefaultTheme} from "styled-components";

import {commonTheme} from "./common";

export const lightTheme: DefaultTheme = {
    ...commonTheme,
    palette: {
        primary: {
            light: "",
            main: "#2F334D",
            dark: "#292C43"
        },
        secondary: {
            light: "",
            main: "#476EEF",
            dark: ""
        },
        error: {
            light: "",
            main: "#D84040",
            dark: ""
        },
        warning: {
            light: "#F84469",
            main: "",
            dark: ""
        },
        info: {
            light: "",
            main: "",
            dark: ""
        },
        success: {
            light: "",
            main: "#4BB34B",
            dark: ""
        },
        divider: "#2D314B",
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