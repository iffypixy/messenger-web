import React from "react";

import {PrivateRoute, PublicOnlyRoute} from "@lib/routing";
import {HomePage} from "./home";
import {LoginPage} from "./login";
import {RegisterPage} from "./register";
import {ViewPage} from "./view";

export const Routes: React.FC = () => {
  return (
    <>
      <PrivateRoute path="/:companionId" component={ViewPage} exact />
      <PrivateRoute path="/" component={HomePage} exact/>
      <PublicOnlyRoute path="/login" component={LoginPage} exact/>
      <PublicOnlyRoute path="/register" component={RegisterPage} exact/>
    </>
  );
};