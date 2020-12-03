import {createGlobalStyle} from "styled-components";

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
`;