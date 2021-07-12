import React, {ReactElement} from "react";
import {useSelector} from "react-redux";

import {authSelectors} from "@features/auth";

export const AuthGuard: React.FC = ({children}) => {
  const isAuthenticated = useSelector(authSelectors.isAuthenticated);

  if (!isAuthenticated) return null;

  return children as ReactElement;
};