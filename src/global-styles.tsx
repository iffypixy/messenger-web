import {createGlobalStyle, css} from "styled-components";

export const GlobalStyles = createGlobalStyle`
    html {
      font-size: ${({theme}) => theme.typography.htmlFontSize};
      box-sizing: border-box;
    }
    
    *, *::before, *::after {
      box-sizing: inherit;
      margin: 0;
      padding: 0;
    }
    
    body {
      background-color: ${({theme}) => theme.palette.background.default};
      font-size: ${({theme}) => theme.typography.fontSize};
    }

    svg {
      display: block;
      fill: ${({theme}) => theme.palette.text.primary};
    }
    
    ${({theme}) => css`
      @media only screen and (min-width: ${theme.breakpoints.xs}px) {
        html {
          font-size: 50%;
        }
      }

      @media only screen and (min-width: ${theme.breakpoints.sm}px) {
        html {
          font-size: 55%;
        }
      }

      @media only screen and (min-width: ${theme.breakpoints.md}px) {
        html {
          font-size: 60%;
        }
      }

      @media only screen and (min-width: ${theme.breakpoints.lg}px) {
        html {
          font-size: 65%;
        }
      }  

      @media only screen and (min-width: ${theme.breakpoints.xl}px) {
        html {
          font-size: 70%;
        }
      }
    `}
`;