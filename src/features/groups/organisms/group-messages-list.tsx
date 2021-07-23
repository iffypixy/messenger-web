import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";

import {authSelectors} from "@features/auth";
import {Message, MessageSkeleton, SystemMessage} from "@features/chats";
import {Col} from "@lib/layout";
import {ID} from "@lib/typings";
import {useRootDispatch} from "@lib/store";
import {isElementVisible, scrollToBottom, isAtTop, getOuterHeight} from "@lib/dom";
import * as actions from "../actions";
import * as selectors from "../selectors";

const DEFAULT_SKELETON_LIST = 7;

export const GroupMessagesList: React.FC = () => {
  const dispatch = useRootDispatch();

  const [isScrolled, setIsScrolled] = useState(false);

  const {groupId} = useParams<{groupId: ID}>();

  const listRef = useRef<HTMLDivElement | null>(null);

  const credentials = useSelector(authSelectors.credentials)!;
  const messages = useSelector(selectors.messages(groupId));
  const areMessagesFetching = useSelector(selectors.areMessagesFetching(groupId));
  const areMessagesFetched = useSelector(selectors.areMessagesFetched(groupId));
  const areMessagesLeftToFetch = useSelector(selectors.areMessagesLeftToFetch(groupId));

  const last = messages[messages.length - 1];

  useEffect(() => {
    const list = listRef.current!;

    scrollToBottom(list);
    handleReadingMessages(list);
  }, [groupId]);

  useEffect(() => {
    if (!last) return;

    const list = listRef.current!;

    const isOwn = last.sender && (last.sender.id === credentials.id);

    const isAtBottom = list.scrollTop + list.clientHeight +
      getOuterHeight(list.children[list.children.length - 1] as HTMLElement) >= list.scrollHeight

    if (isAtBottom || isOwn || !isScrolled) {
      scrollToBottom(list);
      handleReadingMessages(list);
    }

    if (!isScrolled) setIsScrolled(true);
  }, [last]);

  const handleListScroll = ({currentTarget}: React.UIEvent<HTMLDivElement>) => {
    const toFetchMessages = isAtTop(currentTarget) && !areMessagesFetching && areMessagesLeftToFetch;

    if (toFetchMessages) {
      dispatch(actions.fetchMessages({
        groupId, skip: messages.length
      }));
    }

    handleReadingMessages(currentTarget);
  };

  const handleReadingMessages = (list: Element) => {
    const messages = [...list.children] as HTMLElement[];
    const reversed = [...messages].reverse();

    const last = reversed.find((message) =>
      message.dataset.isRead === "false" && message.dataset.isOwn === "false") || null;

    const isVisible = !!last && isElementVisible(last);

    if (!isVisible) return;

    const id = last!.dataset.id as ID;

    dispatch(actions.setMessagesRead({
      groupId, messageId: id
    }));

    const unread = reversed.slice(0, reversed.indexOf(last!))
      .filter((message) =>
        message.dataset.isOwn === "false" &&
        message.dataset.isRead === "false").length;

    dispatch(actions.setUnread({
      groupId, unread
    }));

    dispatch(actions.fetchReadingMessage({
      messageId: id, groupId
    }));
  };

  return (
    <List ref={listRef} onScroll={handleListScroll}>
      {(areMessagesFetching && !areMessagesFetched) && Array.from(
        {length: DEFAULT_SKELETON_LIST},
        (_, idx) => <MessageSkeleton key={idx}/>
      )}

      {messages.map(({id, images, files, audio, text, sender, isSystem, isRead, createdAt}) => {
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
