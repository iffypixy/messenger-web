import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";

import {authSelectors} from "@features/auth";
import {Message, SystemMessage} from "@features/chats";
import {Col} from "@lib/layout";
import {ID} from "@lib/typings";
import {useRootDispatch} from "@lib/store";
import {getScrollDifference, scrollDown, scrollToBottom} from "@lib/dom";
import {H2} from "@ui/atoms";
import {GroupChatMessage} from "../lib/typings";
import * as actions from "../actions";
import * as selectors from "../selectors";

const SCROLL_OFFSET = 450;

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

  useEffect(() => {
    const list = listRef.current;

    if (!!list && !!messages) {
      if (!isScrolled) {
        if (!!scroll) scrollDown(list, scroll);
        else scrollToBottom(list);

        return setIsScrolled(true);
      }

      const last = messages && messages[messages.length - 1];

      if (!!last) {
        const isOwn = ((!!last.sender && last.sender.id) === credentials.id);
        const isScrolledEnough = getScrollDifference(list) <= SCROLL_OFFSET;

        if (isOwn || isScrolledEnough) scrollToBottom(list);
      }
    }
  }, [messages]);

  const handleListScroll = (event: React.UIEvent<HTMLDivElement>) => {
    dispatch(actions.setScroll({
      groupId, scroll: event.currentTarget.scrollTop
    }));
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
