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
import {scrollToBottom, isElementVisible, getTopOffset, getBottomOffset} from "@lib/dom";
import {H2} from "@ui/atoms";
import {DirectChatMessage} from "../lib/typings";
import * as actions from "../actions";
import * as selectors from "../selectors";

interface DirectMessagesListProps {
  messages: DirectChatMessage[] | null;
  areFetching: boolean;
}

export const DirectMessagesList: React.FC<DirectMessagesListProps> = ({messages, areFetching}) => {
  const dispatch = useRootDispatch();

  const [isScrolled, setIsScrolled] = useState(false);

  const {partnerId} = useParams<{partnerId: ID}>();

  const listRef = useRef<HTMLDivElement | null>(null);

  const credentials = useSelector(authSelectors.credentials)!;
  const scroll = useSelector(selectors.scroll(partnerId));
  const areMessagesFetched = useSelector(selectors.areMessagesFetched(partnerId));
  const areMessagesFetching = useSelector(selectors.areMessagesFetching(partnerId));
  const areMessagesLeftToFetch = useSelector(selectors.areMessagesLeftToFetch(partnerId));

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
      partnerId, scroll: isAtTheBottom ?
        BOTTOM_OFFSET : currentTarget.scrollTop
    }));

    const isAtTheTop = getTopOffset(currentTarget as Element) <= CHAT_OFFSET;

    const toFetchMessages = isAtTheTop && !areMessagesFetching && areMessagesLeftToFetch;

    if (toFetchMessages) {
      dispatch(actions.fetchMessages({
        partnerId, partner: partnerId,
        skip: messages ? messages.length : 0
      }));
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
          partnerId,
          messageId: id
        }));

        const numberOfUnreadMessages = reversed.slice(0, reversed.indexOf(unread))
          .filter((message) =>
            message.dataset.isOwn === "false" &&
            message.dataset.isRead === "false").length;

        dispatch(actions.setNumberOfUnreadMessages({
          partnerId, number: numberOfUnreadMessages
        }));

        dispatch(actions.fetchReadingMessage({
          message: id,
          partner: partnerId
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
