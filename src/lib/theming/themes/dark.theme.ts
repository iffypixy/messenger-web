import {DefaultTheme} from "styled-components";

import {commonTheme} from "./common";

export const darkTheme: DefaultTheme = {
    ...commonTheme,
    palette: {
        primary: {
            light: "#25294A",
            main: "#202442",
            dark: "#292C43"
        },
        secondary: {
            light: "#406AE0",
            main: "",
            dark: ""
        },
        error: {
            light: "",
            main: "#F44336",
            dark: ""
        },
        warning: {
            light: "",
            main: "#F65164",
            dark: ""
        },
        info: {
            light: "",
            main: "",
            dark: ""
        },
        icon: {
            active: "#F3F6FD",
            main: "#514A7B"
        },
        success: {
            light: "",
            main: "",
            dark: ""
        },
        text: {
            primary: "#FAFAFA",
            secondary: "#4A4E6B"
        },
        background: {
            paper: "#303030",
            default: "#212121"
        },
        action: {
            hover: "rgba(0, 0, 0, 0.04)",
            disabled: "rgba(0, 0, 0, 0.26)",
            focus: "rgba(0, 0, 0, 0.12)"
        },
        divider: "#2B2F4E"
    }
};