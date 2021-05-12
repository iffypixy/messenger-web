import * as React from "react";
import {ThemeProvider} from "styled-components";
import {useSelector} from "react-redux";

import {darkTheme, lightTheme} from "./themes";
import * as selectors from "./selectors";

export const ThemingProvider: React.FC = ({children}) => {
    const theme = useSelector(selectors.theme);

    return (
        <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
            {children}
        </ThemeProvider>
    );
};