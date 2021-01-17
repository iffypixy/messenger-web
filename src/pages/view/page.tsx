import React, {useEffect} from "react";
import {useParams, useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import {unwrapResult} from "@reduxjs/toolkit";
import {nanoid} from "nanoid";

import {authSelectors} from "@features/auth";
import {ChatTemplate, ChatHeader, MessagesList, MessageForm, getMessagesIds} from "@features/chat";
import {chatDialogsActions, chatDialogsSelectors} from "@features/chat/features/dialogs";
import {useActions} from "@lib/hooks";
import {socket, events} from "@lib/socket";
import {ID, Message, MessageData} from "@api/common";
import {UserAvatar} from "@features/user";

const DEFAULT_NUMBER_OF_FETCHING_MESSAGES = 30;
const MESSAGE_FETCHING_OFFSET_PERCENT = 0.3;

export const ViewPage: React.FC = () => {
  const credentials = useSelector(authSelectors.credentialsSelector)!;
  const dialog = useSelector(chatDialogsSelectors.dialogSelector);
  const list = useSelector(chatDialogsSelectors.listSelector);

  const {fetchCompanion, fetchMessages, setCurrentCompanionId, fetchDialogs} =
    useActions(chatDialogsActions);

  const {companionId} = useParams<{companionId: ID}>();

  const history = useHistory();

  const companion = dialog && dialog.companion;
  const messages = dialog && dialog.messages;

  useEffect(() => {
    setCurrentCompanionId({id: companionId});

    if (companionId === credentials.id)
      history.push("/");

    if (!companion)
      fetchCompanion({id: companionId});

    if (!messages)
      fetchMessages({
        companionId, skip: 0,
        limit: DEFAULT_NUMBER_OF_FETCHING_MESSAGES
      });
  }, [companionId]);

  useEffect(() => {
    if (!list) fetchDialogs();
  }, []);

  return (
    <ChatTemplate>
      <DialogHeader/>
      <DialogMessages/>
      <DialogForm/>
    </ChatTemplate>
  );
};

const DialogHeader: React.FC = () => {
  const isCompanionFetching = useSelector(chatDialogsSelectors.isCompanionFetchingSelector);
  const dialog = useSelector(chatDialogsSelectors.dialogSelector);

  const companion = dialog && dialog.companion;

  const avatar = companion && <UserAvatar user={companion}/>;
  const title = companion && companion.fullName;
  const subtitle = companion && (companion.online ? "Online" : companion.lastSeen);

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

  const dialog = useSelector(chatDialogsSelectors.dialogSelector);
  const areMessagesFetching = useSelector(chatDialogsSelectors.areMessagesFetchingSelector);

  const {companionId} = useParams<{companionId: ID}>();

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
      }
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