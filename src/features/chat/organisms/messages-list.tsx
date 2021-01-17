import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import format from "date-fns/format";
import styled from "styled-components";

import {authSelectors} from "@features/auth";
import {Message} from "@api/common";
import {Message as MessageComponent} from "@features/chat";
import {MessageSkeleton} from "@features/chat";
import {Text} from "@ui/atoms";
import {scrollElementToBottom} from "@lib/dom";

const DEFAULT_SKELETON_LIST = 5;
const MESSAGE_READING_OFFSET_PERCENT = 1.3;

interface Props {
  messages: Message[] | null;
  areFetching: boolean;
  handleListScroll: (element: Element) => void;
}

let isScrolled = false;

export const MessagesList: React.FC<Props> = ({messages, areFetching, handleListScroll}) => {
  const credentials = useSelector(authSelectors.credentialsSelector)!;

  const listRef = useRef<HTMLDivElement>(null);

  const msg = messages && messages[messages.length - 1];

  useEffect(() => {
    if (msg) {
      const list = listRef.current!;

      if (!isScrolled) {
        isScrolled = true;

        return scrollElementToBottom(list);
      } else {
        handleListScroll(list);

        const isScrolledToTheBottomEnough = list.scrollHeight - list.scrollTop <
          (document.documentElement.clientHeight * MESSAGE_READING_OFFSET_PERCENT);

        const own = msg.sender.id === credentials.id;

        if (own || isScrolledToTheBottomEnough)
          scrollElementToBottom(list);
      }
    }
  }, [msg]);

  return (
    <List ref={listRef} onScroll={({currentTarget}) => handleListScroll(currentTarget)}>
      {areFetching && Array.from({length: DEFAULT_SKELETON_LIST}, (_, idx) => <MessageSkeleton key={idx}/>)}

      {messages && messages.map((msg, idx) => {
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

            <MessageComponent
              id={msg.id}
              own={credentials!.id === msg.sender.id}
              text={msg.text}
              sender={msg.sender}
              createdAt={msg.createdAt}
              read={msg.read}
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

