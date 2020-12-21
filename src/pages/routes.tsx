import React from "react";
import {Switch} from "react-router-dom";

import {PrivateRoute, PublicOnlyRoute} from "@lib/routing";
import {HomePage} from "./home";
import {LoginPage} from "./login";
import {RegisterPage} from "./register";
import {ViewPage} from "./view";

export const Routes: React.FC = () => (
  <Switch>
    <PrivateRoute path="/" component={HomePage} exact />
    <PublicOnlyRoute path="/login" component={LoginPage} exact />
    <PublicOnlyRoute path="/register" component={RegisterPage} exact />
    <PrivateRoute path="/:companionId" component={ViewPage} exact />
  </Switch>
);
