import React, {useEffect, useState} from "react";
import {useParams, useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import {unwrapResult} from "@reduxjs/toolkit";
import {nanoid} from "nanoid";
import styled from "styled-components";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import {authSelectors} from "@features/auth";
import {ChatTemplate, ChatHeader, MessagesList, MessageForm, getMessagesIds, AttachmentSidebar} from "@features/chat";
import {chatDialogsActions, chatDialogsSelectors} from "@features/chat/features/dialogs";
import {useActions} from "@lib/hooks";
import {socket, events} from "@lib/socket";
import {ID, Message, MessageData} from "@api/common";
import {dialogApi} from "@api/dialog.api";
import {UserAvatar, userSelectors} from "@features/user";

const DEFAULT_NUMBER_OF_FETCHING_MESSAGES = 30;
const MESSAGE_FETCHING_OFFSET_PERCENT = 0.3;

export const ViewPage: React.FC = () => {
  const {companionId} = useParams<{companionId: ID}>();
  const history = useHistory();

  const [sidebarOptions, setSidebarOptions] = useState({open: false});

  const credentials = useSelector(authSelectors.credentialsSelector)!;
  const dialogs = useSelector(chatDialogsSelectors.dialogsSelector);
  const list = useSelector(chatDialogsSelectors.listSelector);
  const onlineUsersIds = useSelector(userSelectors.onlineUsersIds);

  const {fetchCompanion, fetchMessages, setCurrentCompanionId, fetchDialogs, updateCompanion} =
    useActions(chatDialogsActions);

  const dialog = dialogs[companionId];

  useEffect(() => {
    updateCompanion({
      companionId, companion: {
        online: onlineUsersIds.includes(companionId)
      }
    });
  }, [onlineUsersIds]);

  useEffect(() => {
    setCurrentCompanionId({id: companionId});

    if (companionId === credentials.id)
      history.push("/");

    if (!dialog?.companion?.id)
      fetchCompanion({id: companionId});

    if (!dialog?.areAllMessagesFetched) fetchMessages({
      companionId, skip: dialog?.messages?.length || 0,
      limit: DEFAULT_NUMBER_OF_FETCHING_MESSAGES
    });
  }, [companionId]);

  useEffect(() => {
    if (!list) fetchDialogs();
  }, []);

  return (
    <ChatTemplate>
      <DialogWrapper fullWidth={!true}>
        <DialogHeader/>
        <DialogMessages/>
        <DialogForm/>
      </DialogWrapper>

      {true && <DialogAttachmentSidebar files={{number: 2}} audios={{number: 32}} images={{number: 3}}/>}
    </ChatTemplate>
  );
};

const DialogHeader: React.FC = () => {
  const isCompanionFetching = useSelector(chatDialogsSelectors.isCompanionFetchingSelector);
  const dialog = useSelector(chatDialogsSelectors.dialogSelector);

  const companion = dialog && dialog.companion;

  const avatar = companion && <UserAvatar user={companion}/>;
  const title = companion && companion.fullName;
  const subtitle = companion && (
    companion.status ? companion.status :
      companion.online ? "Online" : companion.lastSeen && formatDistanceToNow(new Date(companion.lastSeen), {addSuffix: true})
  );

  return (
    <ChatHeader
      isFetching={isCompanionFetching}
      avatar={avatar}
      title={title}
      subtitle={subtitle}/>
  );
};

const DialogMessages: React.FC = () => {
  const {fetchMessages, setMessagesRead, fetchReadMessages} = useActions(chatDialogsActions);

  const {companionId} = useParams<{companionId: ID}>();

  const dialog = useSelector(chatDialogsSelectors.dialogSelector);
  const areMessagesFetching = useSelector(chatDialogsSelectors.areMessagesFetchingSelector);

  const messages = dialog && dialog.messages;
  const areAllMessagesFetched = dialog && dialog.areAllMessagesFetched;

  const handleMessagesListScroll = (list: Element) => {
    if (!document.hidden) {
      const isScrolledToTheTopEnough = list.scrollTop < document.documentElement.clientHeight * MESSAGE_FETCHING_OFFSET_PERCENT;

      if (!areAllMessagesFetched && isScrolledToTheTopEnough)
        fetchMessages({
          companionId, skip: messages?.length || 0,
          limit: DEFAULT_NUMBER_OF_FETCHING_MESSAGES
        });

      const messagesIds = getMessagesIds(list, {own: false, read: false});

      if (messagesIds.length) {
        setMessagesRead({messagesIds, companionId});

        fetchReadMessages({messagesIds, companionId})
          .then(unwrapResult)
          .then(() => socket.emit(events.dialogs.READ_MESSAGES, {messagesIds, recipientId: companionId}))
          .catch(() => null);
      }
    }
  };

  return (
    <MessagesList
      messages={messages}
      areFetching={areMessagesFetching}
      handleListScroll={handleMessagesListScroll}/>
  );
};

const DialogForm: React.FC = () => {
  const {fetchCreateMessage, addMessage, updateMessage} = useActions(chatDialogsActions);

  const credentials = useSelector(authSelectors.credentialsSelector)!;

  const {companionId} = useParams<{companionId: ID}>();

  const handleDialogFormSubmit = ({text, filesIds, imagesIds, audioId}: MessageData) => {
    const id = nanoid();

    addMessage({
      message: {
        id, text,
        sender: credentials,
        createdAt: new Date().toISOString(),
        read: false, attachment: null
      },
      companionId, own: true
    });

    fetchCreateMessage({message: {text, filesIds, imagesIds, audioId}, companionId})
      .then(unwrapResult)
      .then(({message}: {message: Message}) => {
        updateMessage({companionId, updatedMessage: message, messageId: id});

        socket.emit(events.dialogs.CREATE_MESSAGE, {message, recipientId: companionId});
      });
  };

  const handleDialogFormTextInputChange = () => {
    socket.emit(events.dialogs.TYPING, {recipientId: companionId});
  };

  return (
    <MessageForm
      handleFormSubmit={handleDialogFormSubmit}
      handleTextInputChange={handleDialogFormTextInputChange}/>
  );
};

const DialogAttachmentSidebar: React.FC = () => {
  const {companionId} = useParams<{companionId: ID}>();

  useEffect(() => {
    dialogApi.getAttachmentNumber({companionId});
  }, []);

  return (
    <AttachmentSidebar
      files={{number: 2}} audios={{number: 32}}
      images={{number: 3}} fetching={false}/>
  );
};

interface DialogWrapperProps {
  fullWidth?: boolean;
}

const DialogWrapper = styled.div<DialogWrapperProps>`
  display: flex;
  flex-direction: column;
  width: ${({fullWidth}) => fullWidth ? "100%" : "calc(100% - 27.5rem)"};
  height: 100%;
`;