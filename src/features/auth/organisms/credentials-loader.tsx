import React, {ReactElement, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import * as selectors from "../selectors";
import * as actions from "../actions";

export const CredentialsLoader: React.FC = ({children}) => {
  const dispatch = useDispatch();

  const isFetching = useSelector(selectors.areCredentialsFetching);
  const isAuthenticated = useSelector(selectors.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(actions.fetchCredentials());
    }
  }, []);

  if (isFetching) return null;

  return children as ReactElement;
};