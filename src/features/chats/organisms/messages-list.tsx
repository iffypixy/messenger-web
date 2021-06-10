import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";

import {authSelectors} from "@features/auth";
import {DirectChatMessage} from "@features/directs";
import {GroupChatMessage} from "@features/groups";
import {Col} from "@lib/layout";
import {H2} from "@ui/atoms";
import {Message, SystemMessage} from "./message";
import {scrollToBottom} from "@lib/dom";

interface MessagesListProps {
  messages: (DirectChatMessage | GroupChatMessage)[] | null;
  areFetching: boolean;
}

export const MessagesList: React.FC<MessagesListProps> = ({messages, areFetching}) => {
  const listRef = useRef<HTMLDivElement | null>(null);

  const credentials = useSelector(authSelectors.credentials)!;

  useEffect(() => {
    if (!areFetching && !!listRef.current) scrollToBottom(listRef.current);
  }, [areFetching, listRef.current]);

  return (
    <List ref={listRef}>
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
