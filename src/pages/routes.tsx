import * as React from "react";
import {Switch} from "react-router-dom";

import {LoginPage} from "@pages/login";
import {PublicOnlyRoute} from "@lib/routing";

export const Routes: React.FC = () => (
    <Switch>
        <PublicOnlyRoute component={LoginPage} path="/login" exact />
    </Switch>
);