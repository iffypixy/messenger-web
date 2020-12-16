import React from "react";
import {Redirect, Route, RouteProps} from "react-router-dom";
import {useSelector} from "react-redux";

import {authSelectors} from "@features/auth";

export const PrivateRoute: React.FC<RouteProps> = (props) => {
  const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);

  if (isAuthenticated) return <Route {...props} />;

  return <Redirect to="/login" />
};

export const PublicOnlyRoute: React.FC<RouteProps> = (props) => {
  const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);

  if (isAuthenticated) return <Redirect to="/" />;

  return <Route {...props} />;
};