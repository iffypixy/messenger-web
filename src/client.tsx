import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";

import {store} from "@lib/store";
import {App} from "./app";
import {ThemingProvider} from "@lib/theming";

const root = document.getElementById("root");

ReactDOM.render(
    <Provider store={store}>
        <ThemingProvider>
            <App />
        </ThemingProvider>
    </Provider>,
    root
);