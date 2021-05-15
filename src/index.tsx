import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";

import {ThemingProvider} from "@lib/theming";
import {store} from "@lib/store";
import {App} from "./app";

const root = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemingProvider>
        <App/>
      </ThemingProvider>
    </BrowserRouter>
  </Provider>,
  root
);