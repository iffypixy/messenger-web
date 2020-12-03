import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    breakpoints: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
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
      h1: IHeading;
      h2: IHeading;
      h3: IHeading;
      h4: IHeading;
      h5: IHeading;
      h6: IHeading;
    };
    palette: {
      primary: IPaletteColor;
      secondary: IPaletteColor;
      error: IPaletteColor;
      warning: IPaletteColor;
      info: IPaletteColor;
      success: IPaletteColor;
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

interface IHeading {
  fontFamily: string;
  fontWeight: number;
  fontSize: string | number;
  lineHeight: number;
  letterSpacing: string | number;
}

interface IPaletteColor {
  light: string;
  main: string;
  dark: string;
  contrastText?: string;
}