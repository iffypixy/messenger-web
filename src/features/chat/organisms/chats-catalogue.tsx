import React from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {useParams, Link} from "react-router-dom";
import format from "date-fns/format";

import {H3, Input, Text, Avatar} from "@ui/atoms";
import {useActions} from "@lib/hooks";
import {authSelectors} from "@features/auth";
import {User} from "@api/auth.api";
import {UserName} from "@features/user";
import {transformMessageToText} from "../lib";
import {chatDialogsSelectors} from "../features/dialogs";
import * as actions from "../actions";
import * as selectors from "../selectors";

export const ChatsCatalogue: React.FC = () => (
  <Catalogue>
    <Header>
      <H3>Messages</H3>
      <Text>+ New chat</Text>
    </Header>
    <SearchBar />
    <ChatsList />
  </Catalogue>
);

const Catalogue = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
  height: 100%;
  background-color: ${({theme}) => theme.palette.primary.dark};
  padding: 2% 5%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
`;

const SearchBar: React.FC = () => {
  const {setSearch} = useActions(actions);

  const search = useSelector(selectors.searchSelector);

  const handleChange = ({currentTarget}: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(currentTarget.value);
  };

  return (
    <SearchBarWrapper>
      <Input
        onChange={handleChange}
        width="100%"
        value={search}
        placeholder="Search chats"
      />
    </SearchBarWrapper>
  );
};

const SearchBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
`;

const ChatsList: React.FC = () => {
  const credentials = useSelector(authSelectors.credentialsSelector);
  const dialogs = useSelector(chatDialogsSelectors.listSelector);
  const search = useSelector(selectors.searchSelector);

  const {companionId} = useParams<{companionId: string}>();

  return (
    <List>
      {[...dialogs]
        .sort(
          (a, b) =>
            +new Date(a.lastMessage.createdAt) -
            +new Date(b.lastMessage.createdAt)
        )
        .filter(({companion}) =>
          companion.firstName.toLowerCase().startsWith(search.toLowerCase())
        )
        .map(({id, companion, lastMessage}) => {
          const text = transformMessageToText({
            message: lastMessage,
            isOwn: lastMessage.sender.id === credentials!.id
          });

          return (
            <Item
              key={id}
              companion={companion}
              text={text}
              isSelected={companion.id === companionId}
              date={new Date(lastMessage.createdAt)}
            />
          );
        })}
    </List>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  & > :not(:first-child) {
    margin-top: 2rem;
  }
`;

interface ItemProps {
  text: string;
  companion: User;
  date: Date;
  isSelected: boolean;
}

const Item: React.FC<ItemProps> = ({text, companion, date, isSelected}) => (
  <ChatLink to={`/${companion.id}`}>
    <ItemWrapper blue={isSelected}>
      <ComponionAvatar>
        <Avatar src={companion.avatar} />
      </ComponionAvatar>

      <ItemContent>
        <UserName>{companion.firstName}</UserName>
        <Text white={isSelected}>{text}</Text>
      </ItemContent>

      <ItemInfo>
        {date && <Text white={isSelected}>{format(date, "HH:mm")}</Text>}
      </ItemInfo>
    </ItemWrapper>
  </ChatLink>
);

const ItemWrapper = styled.div<{blue: boolean}>`
  width: 100%;
  display: flex;
  background-color: ${({theme, blue}) =>
    blue ? theme.palette.secondary.main : theme.palette.primary.main};
  border-radius: 5px;
  padding: 1.5rem;
`;

const ComponionAvatar = styled.div`
  width: 6.5rem;
  height: 6.5rem;
`;

const ItemContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 70%;
  padding: 1rem 0 1rem 1.5rem;
`;

const ItemInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  width: calc(30% - 65px);
`;

const ChatLink = styled(Link)`
  text-decoration: none;
`;
