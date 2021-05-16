import * as React from "react";
import {Switch} from "react-router-dom";

import {PublicOnlyRoute} from "@lib/routing";
import {LoginPage} from "./login";
import {RegisterPage} from "./register";

export const Routes: React.FC = () => (
    <Switch>
        <PublicOnlyRoute component={LoginPage} path="/login" exact />
        <PublicOnlyRoute component={RegisterPage} path="/register" exact />
    </Switch>
);