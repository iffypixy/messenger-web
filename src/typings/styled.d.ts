import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        breakpoints: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
        direction: string;
        typography: {
            htmlFontSize: string | number;
            fontFamily: string;
            fontSize: string;
            fontWeight: {
                light: number;
                regular: number;
                medium: number;
                bold: number;
            };
            h1: Heading;
            h2: Heading;
            h3: Heading;
            h4: Heading;
            h5: Heading;
            h6: Heading;
        };
        palette: {
            primary: PaletteColor;
            secondary: PaletteColor;
            error: PaletteColor;
            warning: PaletteColor;
            info: PaletteColor;
            success: PaletteColor;
            divider: string;
            icon: {
                main: string;
                active: string;
            };
            text: {
                primary: string;
                secondary: string;
            };
            background: {
                paper: string;
                default: string;
            };
            action: {
                hover: string;
                disabled: string;
                focus: string;
            };
        };
    }
}

interface Heading {
    fontFamily: string;
    fontWeight: number;
    fontSize: string;
    lineHeight: number;
    letterSpacing: string;
}

interface PaletteColor {
    light: string;
    main: string;
    dark: string;
}