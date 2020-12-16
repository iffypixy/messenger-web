import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";

import {store} from "@lib/store";
import {App} from "./app";

const root = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>,
  root
);
