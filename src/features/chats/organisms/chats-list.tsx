import React from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";

import {chatsSelectors} from "@features/chats";
import {DirectsListItem, directsSelectors} from "@features/directs";
import {GroupsListItem, groupsSelectors} from "@features/groups";
import {authSelectors} from "@features/auth";
import {usersSelectors} from "@features/users";
import {Col, Row} from "@lib/layout";
import {Text, Circle, H3, H5} from "@ui/atoms";
import {Avatar} from "@ui/molecules";
import {formatMessageDate} from "../lib/formatting";
import {ID} from "@lib/typings";

interface ChatsListItem {
  id: ID;
  name: string;
  avatar: string;
  message: string | null;
  date: Date | null;
  unread: number;
  link: string;
}

const mapDirectToChat = ({details, lastMessage, partner, unread}: DirectsListItem): ChatsListItem => ({
  unread, id: details.id,
  name: partner.username,
  avatar: partner.avatar,
  message: lastMessage && `${lastMessage.text || "Attachments"}`,
  date: lastMessage && new Date(lastMessage.createdAt),
  link: `/direct/${partner.id}`
});

const mapGroupToChat = ({id, title, avatar, lastMessage, unread}: GroupsListItem): ChatsListItem => ({
  id, avatar, unread,
  name: title,
  message: lastMessage && `${lastMessage.text || "Attachments"}`,
  date: lastMessage && new Date(lastMessage.createdAt),
  link: `/group/${id}`
});

export const ChatsList: React.FC = () => {
  const credentials = useSelector(authSelectors.credentials)!;
  const directs = useSelector(directsSelectors.chats);
  const groups = useSelector(groupsSelectors.chats);
  const areDirectsFetching = useSelector(directsSelectors.areChatsFetching);
  const areGroupsFetching = useSelector(groupsSelectors.areChatsFetching);
  const searching = useSelector(chatsSelectors.search);
  const searched = useSelector(usersSelectors.searched);

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

  const filteredSearched = (directs && searched) && searched.filter(({id}) =>
    directs.findIndex(({partner}) => partner.id === id) === -1);

  return (
    <List>
      <Col width="100%" gap="2rem">
        {[...chats]
          .filter(({name}) => name.toLowerCase().startsWith(searching.toLowerCase()))
          .map((props) => (
            <ListItem key={props.id} {...props}/>
          ))}
      </Col>

      {filteredSearched && (
        <SearchList gap="2rem">
          {filteredSearched.length === 0 ? (
            <Row
              width="100%"
              justify="center"
              align="center">
              <H5>No users found</H5>
            </Row>
          ) : filteredSearched.map(({id, username, avatar}) => (
            <ListItem
              key={id}
              name={username}
              avatar={avatar}
              message={null}
              date={null}
              unread={0}
              link={`/direct/${id}`}
            />
          ))}
        </SearchList>
      )}
    </List>
  );
};

const List = styled(Col).attrs(() => ({
  gap: "1rem",
  width: "100%",
  height: "100%"
}))`
  overflow-y: auto;
`;

const SearchList = styled(Col).attrs(() => ({
  width: "100%"
}))`
  border-top: 2px solid ${({theme}) => theme.palette.divider};
  padding-top: 1rem;
`;

interface ListItemProps {
  avatar: string;
  name: string;
  message: string | null;
  date: Date | null;
  unread: number;
  link: string;
}

const ListItem: React.FC<ListItemProps> = ({avatar, name, message, date, unread, link}) => (
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
          {!!unread ? <UnreadMessages>{unread}</UnreadMessages> : null}
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