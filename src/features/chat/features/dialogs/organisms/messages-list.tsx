import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import format from "date-fns/format";
import styled from "styled-components";
import {useParams} from "react-router-dom";
import {unwrapResult} from "@reduxjs/toolkit";

import {authSelectors} from "@features/auth";
import {chatActions, getForeignUnreadMessagesIds, Message, MessageSkeleton} from "@features/chat";
import {useActions} from "@lib/hooks";
import {socket} from "@lib/socket";
import {Text} from "@ui/atoms";
import * as actions from "../actions";
import * as selectors from "../selectors";

const DEFAULT_SKELETON_LIST = 7;

export const MessagesList: React.FC = () => {
  const [isInitiallyScrolled, setIsInitiallyScrolled] = useState<boolean>(false);

  const credentials = useSelector(authSelectors.credentialsSelector);
  const dialog = useSelector(selectors.dialogSelector);
  const areMessagesFetching = useSelector(selectors.areMessagesFetchingSelector);

  const {companionId} = useParams<{companionId: string}>();

  const {fetchReadMessages, setMessagesRead, fetchMessages} = useActions({...actions, ...chatActions});

  const listRef = useRef<HTMLDivElement>(null);

  const messages = dialog?.messages;

  const handleListScroll = ({currentTarget}: React.UIEvent<HTMLDivElement>) => {
    const ids = getForeignUnreadMessagesIds(currentTarget);

    if (currentTarget.scrollTop < 250)
      fetchMessages({
        companionId, take: 30,
        skip: dialog?.messages?.length
      });

    if (ids.length) {
      setMessagesRead({ids, companionId});

      fetchReadMessages(ids)
        .then(unwrapResult)
        .then(() =>
          socket.emit("read-messages", {ids, recipientId: companionId}))
        .catch(() => {});
    }
  };

  useEffect(() => {
    if (!messages) return;

    const list = listRef.current;

    if (!isInitiallyScrolled) {
      list!.scrollTop = list!.scrollHeight;

      setIsInitiallyScrolled(true);
    } else {
      const msg = messages[messages.length - 1];

      if (msg?.sender?.id === credentials!.id ||
        list!.scrollHeight - list!.scrollTop < 1250)
        list!.scrollTop = list!.scrollHeight;
    }
  }, [messages]);

  return (
    <List ref={listRef} onScroll={handleListScroll}>
      {areMessagesFetching && Array.from({length: DEFAULT_SKELETON_LIST}, (_, idx) => <MessageSkeleton key={idx}/>)}

      {messages && messages.map((msg, idx) => {
        const previous = messages[idx - 1];

        const isNewDay = idx === 0 || (previous &&
          +new Date(previous.createdAt).getDay() !==
          +new Date(msg.createdAt).getDay());

        return (
          <React.Fragment key={msg.id || idx}>
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

