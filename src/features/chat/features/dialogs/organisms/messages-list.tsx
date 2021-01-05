import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import format from "date-fns/format";
import styled from "styled-components";
import {useParams} from "react-router-dom";
import {unwrapResult} from "@reduxjs/toolkit";

import {authSelectors} from "@features/auth";
import {chatActions, getMessagesIds, Message, MessageSkeleton} from "@features/chat";
import {useActions} from "@lib/hooks";
import {socket} from "@lib/socket";
import {scrollElementToBottom} from "@lib/dom";
import {Text} from "@ui/atoms";
import * as actions from "../actions";
import * as selectors from "../selectors";
import {ID} from "@api/common";

const DEFAULT_SKELETON_LIST = 7;

const MESSAGE_READING_OFFSET_PERCENT = 1.3;

const MESSAGE_FETCHING_OFFSET = 0.3;

export const MessagesList: React.FC = () => {
  const [isInitiallyScrolled, setIsInitiallyScrolled] = useState<boolean>(false);

  const credentials = useSelector(authSelectors.credentialsSelector);
  const dialog = useSelector(selectors.dialogSelector);
  const areFetching = useSelector(selectors.areMessagesFetchingSelector);

  const {companionId} = useParams<{companionId: ID}>();
  const {fetchReadMessages, setMessagesRead, fetchMessages} = useActions({...actions, ...chatActions});

  const listRef = useRef<HTMLDivElement>(null);

  const messages = dialog?.messages;
  const areAllMessagesFetched = dialog?.areAllMessagesFetched;

  const msg = messages && messages[messages.length - 1];

  useEffect(() => {
    if (!msg) return;

    const list = listRef.current;

    if (!isInitiallyScrolled) {
      scrollElementToBottom(list!);

      return setIsInitiallyScrolled(true);
    }

    const diff = list!.scrollHeight - list!.scrollTop;

    if (msg.sender.id === credentials!.id || diff < (document.documentElement.clientHeight * MESSAGE_READING_OFFSET_PERCENT))
      scrollElementToBottom(list!);
  }, [msg]);

  const handleListScroll = ({currentTarget}: React.UIEvent<HTMLDivElement>) => {
    if (!areAllMessagesFetched && currentTarget.scrollTop < document.documentElement.clientHeight * MESSAGE_FETCHING_OFFSET)
      fetchMessages({companionId, take: 30, skip: messages?.length});

    const ids = getMessagesIds(currentTarget, {own: false, read: false});

    if (ids.length) {
      setMessagesRead({ids, companionId});

      fetchReadMessages({ids})
        .then(unwrapResult)
        .then(() => socket.emit("read-messages", {ids, recipientId: companionId}))
        .catch(() => null);
    }
  };

  return (
    <List ref={listRef} onScroll={handleListScroll}>
      {areFetching && Array.from({length: DEFAULT_SKELETON_LIST}, (_, idx) => <MessageSkeleton key={idx}/>)}

      {messages?.map((msg, idx) => {
        const previous = messages[idx - 1];

        const isNewDay = idx === 0 || (previous &&
          +new Date(previous.createdAt).getDay() !== +new Date(msg.createdAt).getDay());

        return (
          <React.Fragment key={msg.id}>
            {isNewDay && (
              <NewDay>
                <Line/>
                <Text>{format(new Date(msg.createdAt), "dd LLLL")}</Text>
                <Line/>
              </NewDay>
            )}

            <Message
              id={msg.id}
              own={credentials!.id === msg.sender.id}
              text={msg.text}
              sender={msg.sender}
              createdAt={msg.createdAt}
              read={msg.isRead}
            />
          </React.Fragment>
        );
      })}
    </List>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow-y: scroll;
  padding: 2rem 3.5rem 4rem;

  & > :not(:first-child) {
    margin-top: 2rem;
  }
`;

const NewDay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 4rem 0 2rem!important;
`;

const Line = styled.div`
  width: 40%;
  height: 2px;
  background-color: ${({theme}) => theme.palette.primary.main};
`;

