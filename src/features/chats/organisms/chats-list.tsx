import React from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";

import {chatsSelectors} from "@features/chats";
import {directsSelectors} from "@features/directs";
import {groupsSelectors} from "@features/groups";
import {authSelectors} from "@features/auth";
import {usersSelectors} from "@features/users";
import {Col, Row} from "@lib/layout";
import {ID} from "@lib/typings";
import {Text, Circle, H3, H5} from "@ui/atoms";
import {Avatar} from "@ui/molecules";
import {formatMessageDate} from "../lib/formatting";

interface ChatsListItem {
  id: ID;
  name: string;
  avatar: string;
  message: string | null;
  date: Date | null;
  unread: number;
  link: string;
}

export const ChatsList: React.FC = () => {
  const credentials = useSelector(authSelectors.credentials)!;
  const directs = useSelector(directsSelectors.chats);
  const groups = useSelector(groupsSelectors.chats);
  const search = useSelector(chatsSelectors.search);
  const searching = useSelector(usersSelectors.searching);
  const areDirectsFetching = useSelector(directsSelectors.areChatsFetching);
  const areGroupsFetching = useSelector(groupsSelectors.areChatsFetching);

  const isFetching = areDirectsFetching || areGroupsFetching;

  if (isFetching) return (
    <List>
      <H3>Loading...</H3>
    </List>
  );

  const supplementMessage = ({text, isOwn}: {
    text: string | null;
    isOwn: boolean;
  }): string => {
    const message = text || "Attachments";

    return isOwn ? `You: ${message}` : message;
  };

  const chats: ChatsListItem[] = [];

  if (directs) {
    chats.push(...directs.map(({details, lastMessage: {text, sender, createdAt}, partner, unread}) => {
      const isOwn = !!sender && (sender.id === credentials.id);

      const completed = supplementMessage({text, isOwn});

      return {
        unread,
        id: details.id,
        name: partner.username,
        avatar: partner.avatar,
        message: completed,
        date: new Date(createdAt),
        link: `/direct/${partner.id}`
      };
    }));
  }

  if (groups) {
    chats.push(...groups.map(({id, avatar, lastMessage, title, unread}) => {
      const isOwn = (!!lastMessage && !!lastMessage.sender) && (lastMessage.sender.id === credentials.id);

      const completed = supplementMessage({
        text: lastMessage && lastMessage.text, isOwn
      });

      return {
        id, avatar, unread,
        name: title,
        message: completed,
        date: lastMessage && new Date(lastMessage.createdAt),
        link: `/group/${id}`
      };
    }));
  }

  const filtered = (search && directs) && searching.filter(({id}) =>
    credentials.id !== id && !directs.some(({partner}) => partner.id === id));

  return (
    <List>
      <Col width="100%" gap="2rem">
        {[...chats]
          .sort((a, b) => {
            const first = a.date ? +a.date : 0;
            const second = b.date ? +b.date : 0;

            return first - second;
          })
          .map((props) => <ListItem key={props.id} {...props}/>)}
      </Col>

      {filtered && (
        <SearchList gap="2rem">
          {filtered.length === 0 ? (
            <Row
              width="100%"
              justify="center"
              align="center">
              <H5>No users found</H5>
            </Row>
          ) : filtered.map(({id, username, avatar}) => (
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
          {!!unread ? <Unread>{unread}</Unread> : null}
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

const Unread = styled(Circle)`
  font-size: 1rem;
  margin-left: 1rem;
`;