import * as React from "react";
import {RouteProps, Redirect, Route} from "react-router-dom";
import {useSelector} from "react-redux";

import {authSelectors} from "@features/auth";

interface PrivateRouteProps extends RouteProps {}

export const PrivateRoute: React.FC<PrivateRouteProps> = (props) => {
    const isAuthenticated = useSelector(authSelectors.isAuthenticated);

    if (!isAuthenticated) return <Redirect to="/login" />;

    return <Route {...props} />
};

interface PublicOnlyRouteProps extends RouteProps {}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = (props) => {
    const isAuthenticated = useSelector(authSelectors.isAuthenticated);

    if (isAuthenticated) return <Redirect to="/" />;

    return <Route {...props} />
};