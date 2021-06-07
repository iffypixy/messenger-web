import React, {ReactElement, useEffect} from "react";
import {useSelector} from "react-redux";

import {useRootDispatch} from "@lib/store";
import * as selectors from "../selectors";
import * as actions from "../actions";

export const CredentialsLoader: React.FC = ({children}) => {
  const dispatch = useRootDispatch();

  const isFetching = useSelector(selectors.areCredentialsFetching);
  const isAuthenticated = useSelector(selectors.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) dispatch(actions.fetchCredentials());
  }, []);

  if (isFetching) return null;

  return children as ReactElement;
};