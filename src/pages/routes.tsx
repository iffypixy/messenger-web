import React from "react";
import {Switch} from "react-router-dom";

import {PrivateRoute, PublicOnlyRoute} from "@lib/routing";
import {LoginPage} from "./login";
import {RegisterPage} from "./register";
import {HomePage} from "./home";
import {DirectPage} from "./direct";
import {GroupPage} from "./group";

export const Routes: React.FC = () => (
    <Switch>
        <PublicOnlyRoute component={LoginPage} path="/login" exact />
        <PublicOnlyRoute component={RegisterPage} path="/register" exact />
        <PrivateRoute component={HomePage} path="/" exact />
        <PrivateRoute component={DirectPage} path="/direct/:partnerId" exact />
        <PrivateRoute component={GroupPage} path="/group/:groupId" exact />
    </Switch>
);