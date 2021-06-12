import React from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";

import {directsSelectors, mapDirectToChat} from "@features/directs";
import {groupsSelectors, mapGroupToChat} from "@features/groups";
import {authSelectors} from "@features/auth";
import {Col, Row} from "@lib/layout";
import {Text, Circle, H3} from "@ui/atoms";
import {Avatar} from "@ui/molecules";
import {formatMessageDate} from "../lib/formatting";
import {ChatsListItem} from "../lib/typings";

export const ChatsList: React.FC = () => {
  const credentials = useSelector(authSelectors.credentials)!;

  const directs = useSelector(directsSelectors.chats);
  const groups = useSelector(groupsSelectors.chats);

  const areDirectsFetching = useSelector(directsSelectors.areChatsFetching);
  const areGroupsFetching = useSelector(groupsSelectors.areChatsFetching);

  const isFetching = areDirectsFetching || areGroupsFetching;

  if (isFetching) return (
    <List>
      <H3>Loading...</H3>
    </List>
  );

  const chats: ChatsListItem[] = [];

  directs && chats.push(...directs.map((direct) => {
    const chat = mapDirectToChat(direct);

    const lastMessage = direct.lastMessage;
    const isOwn = (lastMessage && lastMessage.sender) && (lastMessage.sender.id === credentials.id);

    const prefix = isOwn ? "You: " : "";

    chat.message = lastMessage && `${prefix}${chat.message}`;

    return chat;
  }));

  groups && chats.push(...groups.map((group) => {
    const chat = mapGroupToChat(group);

    const lastMessage = group.lastMessage;
    const isOwn = (lastMessage && lastMessage.sender) && (lastMessage.sender.id === credentials.id);

    const prefix = isOwn ? "You: " : "";

    chat.message = lastMessage && `${prefix}${chat.message}`;

    return chat;
  }));

  return (
    <List>
      {chats.map((props) => (
        <ListItem key={props.id} {...props}/>
      ))}
    </List>
  );
};

const List = styled(Col).attrs(() => ({
  gap: "2rem",
  width: "100%",
  height: "100%"
}))`
  overflow-y: auto;
`;

interface ListItemProps {
  avatar: string;
  name: string;
  message: string | null;
  date: Date | null;
  unreadMessages: number;
  link: string;
}

const ListItem: React.FC<ListItemProps> = ({avatar, name, message, date, unreadMessages, link}) => (
  <Link to={link}>
    <Wrapper>
      <Avatar url={avatar}/>

      <Col width="80%" height="100%" justify="space-between" padding="1rem 0">
        <Row width="100%" justify="space-between" align="center">
          <Text width="70%" ellipsis>{name}</Text>
          {date && <DateText secondary small>{formatMessageDate(date)}</DateText>}
        </Row>

        <Row width="100%" justify="space-between" align="center">
          {message && <Message>{message}</Message>}
          {!!unreadMessages ? <UnreadMessages>{unreadMessages}</UnreadMessages> : null}
        </Row>
      </Col>
    </Wrapper>
  </Link>
);

const Wrapper = styled(Row).attrs(() => ({
  align: "center",
  justify: "space-between",
  height: "100%",
  padding: "2rem"
}))`
  background-color: ${({theme}) => theme.palette.primary.light};
  border-radius: 1rem;
`;

const DateText = styled(Text)`
  margin-left: 1rem;
`;

const Message = styled(Text).attrs(() => ({
  width: "85%",
  ellipsis: true,
  secondary: true
}))`
  font-size: 1.4rem;
  font-weight: 500;
`;

const UnreadMessages = styled(Circle)`
  font-size: 1rem;
  margin-left: 1rem;
`;