import React from "react";
import {Normalize} from "styled-normalize";
import {Provider} from "react-redux";

import {store} from "@lib/store";
import {ThemeToggleProvider} from "@features/theming";
import {GlobalStyles} from "@/global-styles";

interface Props {
  Component: React.ComponentClass;
  pageProps: Object;
}

const App: React.FC<Props> = ({Component, pageProps}) => (
  <Provider store={store}>
    <ThemeToggleProvider>
      <Normalize/>
      <GlobalStyles/>
      <Component {...pageProps} />
    </ThemeToggleProvider>
  </Provider>
);

export default App;