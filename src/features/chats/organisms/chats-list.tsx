import React from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";

import {chatsSelectors} from "@features/chats";
import {directsSelectors} from "@features/directs";
import {groupsSelectors} from "@features/groups";
import {authSelectors} from "@features/auth";
import {usersSelectors} from "@features/users";
import {Col, Row} from "@lib/layout";
import {Skeleton} from "@lib/skeleton";
import {ID} from "@lib/typings";
import {Text, Circle, H4} from "@ui/atoms";
import {Avatar} from "@ui/molecules";
import {formatMessageDate} from "../lib/formatting";

const DEFAULT_SKELETON_LIST = 5;

interface ChatsListItem {
  id: ID;
  name: string;
  avatar: string;
  message: string | null;
  date: Date | null;
  unread: number;
  link: string;
  isSelected: boolean;
}

export const ChatsList: React.FC = () => {
  const {partnerId, groupId} = useParams<{
    partnerId: ID;
    groupId: ID;
  }>();

  const credentials = useSelector(authSelectors.credentials)!;
  const directs = useSelector(directsSelectors.chats);
  const groups = useSelector(groupsSelectors.chats);
  const search = useSelector(chatsSelectors.search);
  const searching = useSelector(usersSelectors.searching);
  const areDirectsFetching = useSelector(directsSelectors.areChatsFetching);
  const areGroupsFetching = useSelector(groupsSelectors.areChatsFetching);

  const isFetching = areDirectsFetching || areGroupsFetching;

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
        link: `/direct/${partner.id}`,
        isSelected: partner.id === partnerId
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
        link: `/group/${id}`,
        isSelected: id === groupId
      };
    }));
  }

  const filtered = (search && directs) && searching.filter(({id}) =>
    credentials.id !== id && !directs.some(({partner}) => partner.id === id));

  return (
    <List>
      <Col width="100%" gap="2rem">
        {isFetching && Array.from(
          {length: DEFAULT_SKELETON_LIST},
          (_, idx) => <ChatsListItemSkeleton key={idx}/>
        )}

        {!isFetching && [...chats]
          .sort((a, b) => {
            const first = a.date ? +a.date : 0;
            const second = b.date ? +b.date : 0;

            return second - first;
          })
          .map((chat) => <ListItem key={chat.id} {...chat}/>)}
      </Col>

      {filtered && (
        <SearchList gap="2rem">
          {filtered.length === 0 && (
            <Row width="100%" justify="center" align="center">
              <H4>Your search returned no results</H4>
            </Row>
          )}

          {filtered.map(({id, username, avatar}) => (
            <ListItem
              key={id}
              id={id}
              name={username}
              avatar={avatar}
              message={null}
              date={null}
              unread={0}
              link={`/direct/${id}`}
              isSelected={id === partnerId}
            />
          ))}
        </SearchList>
      )}
    </List>
  );
};

const List = styled(Col).attrs(() => ({
  gap: "3rem",
  width: "100%",
  height: "100%"
}))`
  overflow-y: auto;
`;

const SearchList = styled(Col).attrs(() => ({
  width: "100%"
}))`
  border-top: 2px solid ${({theme}) => theme.palette.divider};
  padding-top: 3rem;
`;

interface ListItemProps extends ChatsListItem {
}

const ListItem: React.FC<ListItemProps> = ({avatar, name, message, date, unread, link, isSelected}) => (
  <Link to={link}>
    <Wrapper secondary={isSelected}>
      <Avatar url={avatar}/>

      <Col width="80%" height="100%" justify="space-between" padding="1rem 0">
        <Row width="100%" justify="space-between" align="center">
          <Text width="70%" ellipsis>{name}</Text>

          {date && (
            <DateText secondary={!isSelected} small>
              {formatMessageDate(date)}
            </DateText>
          )}
        </Row>

        <Row width="100%" justify="space-between" align="center">
          {message && <Message secondary={!isSelected}>{message}</Message>}
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
}))<{
  secondary?: boolean;
}>`
  background-color: ${({theme, secondary}) => secondary ? theme.palette.secondary.light : theme.palette.primary.light};
  border-radius: 1rem;
`;

const DateText = styled(Text)`
  margin-left: 1rem;
`;

const Message = styled(Text).attrs(() => ({
  width: "85%",
  ellipsis: true
}))`
  font-size: 1.4rem;
  font-weight: 500;
`;

const Unread = styled(Circle)`
  font-size: 1rem;
  margin-left: 1rem;
`;

const ChatsListItemSkeleton: React.FC = () => (
  <Wrapper>
    <Skeleton.Avatar/>

    <Col width="80%" height="100%" justify="space-between" padding="1rem 0">
      <Row width="100%" justify="space-between" align="center">
        <Skeleton.Text width="40%"/>

        <Skeleton.Text width="5rem"/>
      </Row>

      <Row width="100%" justify="space-between" align="center">
        <Skeleton.Text width="70%"/>
      </Row>
    </Col>
  </Wrapper>
);