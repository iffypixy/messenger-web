import React, {useEffect} from "react";
import {useParams} from "react-router-dom";

import {useActions} from "@lib/hooks";
import {chatDialogsActions} from "@features/chat/features/dialogs";

export const ViewPage: React.FC = () => {
  const {fetchDialog, fetchMessages} = useActions(chatDialogsActions);
  const {companionId} = useParams<{companionId: string}>();

  useEffect(() => {
    fetchDialog({companionId});
    fetchMessages({companionId, take: 20, skip: 0});
  }, []);

  return null;
};
