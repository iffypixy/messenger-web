import * as React from "react";
import {Switch} from "react-router-dom";

import {PrivateRoute, PublicOnlyRoute} from "@lib/routing";
import {LoginPage} from "./login";
import {RegisterPage} from "./register";
import {HomePage} from "./home";

export const Routes: React.FC = () => (
    <Switch>
        <PublicOnlyRoute component={LoginPage} path="/login" exact />
        <PublicOnlyRoute component={RegisterPage} path="/register" exact />
        <PrivateRoute component={HomePage} path="/" exact />
    </Switch>
);