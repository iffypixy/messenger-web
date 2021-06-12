import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";

import {authSelectors} from "@features/auth";
import {Message, SystemMessage, CHAT_OFFSET, BOTTOM_OFFSET} from "@features/chats";
import {Col} from "@lib/layout";
import {ID} from "@lib/typings";
import {useRootDispatch} from "@lib/store";
import {isEmpty} from "@lib/utils";
import {getTopOffset, getBottomOffset, isElementVisible, scrollToBottom} from "@lib/dom";
import {H2} from "@ui/atoms";
import {GroupChatMessage} from "../lib/typings";
import * as actions from "../actions";
import * as selectors from "../selectors";

interface GroupMessagesListProps {
  messages: GroupChatMessage[] | null;
  areFetching: boolean;
}

export const GroupMessagesList: React.FC<GroupMessagesListProps> = ({messages, areFetching}) => {
  const dispatch = useRootDispatch();

  const [isScrolled, setIsScrolled] = useState(false);

  const {groupId} = useParams<{groupId: ID}>();

  const listRef = useRef<HTMLDivElement | null>(null);

  const credentials = useSelector(authSelectors.credentials)!;
  const scroll = useSelector(selectors.scroll(groupId));
  const areMessagesFetched = useSelector(selectors.areMessagesFetched(groupId));
  const areMessagesFetching = useSelector(selectors.areMessagesFetching(groupId));
  const areMessagesLeftToFetch = useSelector(selectors.areMessagesLeftToFetch(groupId));

  const last = messages && messages[messages.length - 1];

  useEffect(() => {
    if (!last) return;

    const list = listRef.current!;

    if (!isScrolled) {
      if (!isEmpty(scroll)) list.scroll(0, scroll);
      else scrollToBottom(list);

      handleReadingMessages(list);

      return setIsScrolled(true);
    }

    const isOwn = ((!!last.sender && last.sender.id) === credentials.id);

    const isAtTheBottom = getBottomOffset(list) <= CHAT_OFFSET +
      list.children[list.children.length - 1].clientHeight;

    if (isOwn || isAtTheBottom) scrollToBottom(list);
  }, [last]);

  useEffect(() => {
    if (isScrolled) listRef.current!.scroll(0, scroll);
  }, [areMessagesFetched]);

  const handleListScroll = ({currentTarget}: React.UIEvent<HTMLDivElement>) => {
    const isAtTheBottom = getBottomOffset(currentTarget as Element) <= CHAT_OFFSET;

    dispatch(actions.setScroll({
      groupId, scroll: isAtTheBottom ?
        BOTTOM_OFFSET : currentTarget.scrollTop
    }));
    
    const isAtTheTop = getTopOffset(currentTarget as Element) <= CHAT_OFFSET;

    const toFetchMessages = isAtTheTop && !areMessagesFetching && areMessagesLeftToFetch;

    if (toFetchMessages) {
      dispatch(actions.fetchMessages({
        groupId, group: groupId,
        skip: messages ? messages.length : 0
      }))
    }

    handleReadingMessages(currentTarget);
  };

  const handleReadingMessages = (list: Element) => {
    const messages = [...list.children] as HTMLElement[];

    const reversed = [...messages].reverse();
    const unread = reversed.find((message) =>
      message.dataset.isRead === "false" && message.dataset.isOwn === "false") || null;

    if (!!unread) {
      const isVisible = isElementVisible(unread);

      if (isVisible) {
        const id = unread.dataset.id as ID;

        dispatch(actions.readMessage({
          groupId, messageId: id
        }));

        const numberOfUnreadMessages = reversed.slice(0, reversed.indexOf(unread))
          .filter((message) =>
            message.dataset.isOwn === "false" &&
            message.dataset.isRead === "false").length;

        dispatch(actions.setNumberOfUnreadMessages({
          groupId, number: numberOfUnreadMessages
        }));

        dispatch(actions.fetchReadingMessage({
          message: id,
          group: groupId
        }));
      }
    }
  };

  return (
    <List ref={listRef} onScroll={handleListScroll}>
      {areFetching && <H2>Loading...</H2>}

      {messages && messages.map(({id, images, files, audio, text, sender, isSystem, isRead, createdAt}) => {
        if (isSystem) return (
          <SystemMessage
            key={id}
            text={text}/>
        );

        const isOwn = (!!sender && sender.id) === credentials.id;

        return (
          <Message
            key={id}
            id={id}
            text={text}
            images={images}
            audio={audio}
            files={files}
            avatar={sender!.avatar}
            date={new Date(createdAt)}
            isOwn={isOwn}
            isRead={isRead}/>
        );
      })}
    </List>
  );
};

const List = styled(Col).attrs(() => ({
  width: "100%",
  padding: "1rem 5rem"
}))`
  flex: 1;
  overflow: auto;
`;
