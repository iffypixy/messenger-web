import React from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";

import {directsSelectors, mapDirectToChat} from "@features/directs";
import {groupsSelectors, mapGroupToChat} from "@features/groups";
import {authSelectors} from "@features/auth";
import {Col} from "@lib/layout";
import {Text, Circle, H3} from "@ui/atoms";
import {Avatar} from "@ui/molecules";
import {formatDate} from "../lib/format-date";
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
    const isOwner = (lastMessage && lastMessage.sender) && (lastMessage.sender.id === credentials.id);

    chat.message = `${isOwner && "You:"} ${chat.message}`;

    return chat;
  }));

  groups && chats.push(...groups.map((group) => {
    const chat = mapGroupToChat(group);

    const lastMessage = group.lastMessage;
    const isOwner = (lastMessage && lastMessage.sender) && (lastMessage.sender.id === credentials.id);

    chat.message = `${isOwner && "You:"} ${chat.message}`;

    return chat;
  }));

  return (
    <List>
      {chats.map(({id, name, avatar, message, date, numberOfUnreadMessages}) => (
        <ListItem
          key={id}
          name={name}
          avatar={avatar}
          message={message}
          numberOfUnreadMessages={numberOfUnreadMessages}
          date={date}/>
      ))}
    </List>
  );
};

const List = styled(Col).attrs(() => ({
  gap: "2rem"
}))`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

interface ListItemProps {
  avatar: string;
  name: string;
  message: string | null;
  date: Date | null;
  numberOfUnreadMessages: number;
}

const ListItem: React.FC<ListItemProps> = ({avatar, name, message, date, numberOfUnreadMessages}) => (
  <Wrapper>
    <Avatar url={avatar}/>

    <Content>
      <Header>
        <Text width="70%" ellipsis>{name}</Text>
        {date && <DateTime secondary small>{formatDate(date)}</DateTime>}
      </Header>

      <Footer>
        {message && <Message>{message}</Message>}
        <Warning>{numberOfUnreadMessages}</Warning>
      </Footer>
    </Content>
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({theme}) => theme.palette.primary.light};
  border-radius: 1rem;
  padding: 2rem;
`;

const Content = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 0;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Footer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DateTime = styled(Text)`
  font-weight: 500;
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

const Warning = styled(Circle)`
  margin-left: 1rem;
`;