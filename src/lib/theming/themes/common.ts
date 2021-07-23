const fontFamily = "\"Jetbrains Mono\", sans-serif";

export const commonTheme = {
    breakpoints: {
        xs: "0px",
        sm: "600px",
        md: "960px",
        lg: "1280px",
        xl: "1920px"
    },
    direction: "ltr",
    typography: {
        htmlFontSize: "62.5%",
        fontFamily: fontFamily,
        fontSize: "1.6rem",
        fontWeight: {
            light: 300,
            regular: 400,
            medium: 600,
            bold: 700
        },
        h1: {
            fontFamily: fontFamily,
            fontWeight: 600,
            fontSize: "6rem",
            lineHeight: 1.167,
            letterSpacing: "-0.01562em"
        },
        h2: {
            fontFamily: fontFamily,
            fontWeight: 600,
            fontSize: "3.75rem",
            lineHeight: 1.2,
            letterSpacing: "-0.00833em"
        },
        h3: {
            fontFamily: fontFamily,
            fontWeight: 600,
            fontSize: "3rem",
            lineHeight: 1.167,
            letterSpacing: "0em"
        },
        h4: {
            fontFamily: fontFamily,
            fontWeight: 500,
            fontSize: "2.125rem",
            lineHeight: 1.235,
            letterSpacing: "0.00735em"
        },
        h5: {
            fontFamily: fontFamily,
            fontWeight: 500,
            fontSize: "1.8rem",
            lineHeight: 1.334,
            letterSpacing: "0em"
        },
        h6: {
            fontFamily: fontFamily,
            fontWeight: 500,
            fontSize: "1.25rem",
            lineHeight: 1.6,
            letterSpacing: "0.0075em"
        }
    }
};