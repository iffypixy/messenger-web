import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {PayloadAction} from "@reduxjs/toolkit";

import {authSelectors, authActions} from "@features/auth";
import {useActions} from "@lib/hooks";
import {socket} from "@lib/socket";
import {User} from "@api/auth.api";

interface Props {
  children: React.ReactElement;
}

export const CredentialsLoader: React.FC<Props> = ({children}) => {
  const areCredentialsFetching = useSelector(
    authSelectors.areCredentialsFetching
  );

  const {fetchCredentials} = useActions(authActions);

  useEffect(() => {
    fetchCredentials();
  }, []);

  if (areCredentialsFetching) return null;

  return children;
};
