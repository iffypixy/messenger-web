import React, {useEffect} from "react";
import {useParams, useHistory} from "react-router-dom";
import {useSelector} from "react-redux";

import {authSelectors} from "@features/auth";
import {ChatTemplate} from "@features/chat";
import {chatDialogsActions, chatDialogsSelectors, DialogForm, DialogHeader, MessagesList} from "@features/chat/features/dialogs";
import {useActions} from "@lib/hooks";
import {ID} from "@api/common";

export const ViewPage: React.FC = () => {
  const credentials = useSelector(authSelectors.credentialsSelector);
  const dialog = useSelector(chatDialogsSelectors.dialogSelector);
  const list = useSelector(chatDialogsSelectors.listSelector)

  const {fetchCompanion, fetchMessages, setCurrentCompanionId, fetchDialogs} = useActions(chatDialogsActions);

  const {companionId} = useParams<{companionId: ID}>();

  const history = useHistory();

  useEffect(() => {
    setCurrentCompanionId({id: companionId});
  }, [companionId]);

  useEffect(() => {
    if (!list)
      fetchDialogs();
  }, []);

  useEffect(() => {
    if (companionId === credentials!.id)
      history.push("/");

    if (!dialog?.companion)
      fetchCompanion({id: companionId});

    if (!dialog?.messages)
      fetchMessages({companionId, take: 30, skip: 0});
  }, [companionId]);

  return (
    <ChatTemplate>
      <DialogHeader />
      <MessagesList />
      <DialogForm />
    </ChatTemplate>
  );
};

