import React from "react";
import styled, {css} from "styled-components";
import {useSelector} from "react-redux";
import {useParams, Link} from "react-router-dom";
import format from "date-fns/format";

import {authSelectors} from "@features/auth";
import {UserName} from "@features/user";
import {H3, Input, Text, Avatar, Icon} from "@ui/atoms";
import {useActions} from "@lib/hooks";
import {Row, Col} from "@lib/layout";
import {IUser} from "@api/common";
import {transformMessageToText} from "../lib";
import {chatDialogsSelectors} from "../features/dialogs";
import * as actions from "../actions";
import * as selectors from "../selectors";

export const ChatsCatalogue: React.FC = () => {
  const dialogs = useSelector(chatDialogsSelectors.listSelector);

  const number = dialogs ? dialogs.reduce((previous, current) => {
    return previous + current.unreadMessagesNumber;
  }, 0) : 0;

  return (
    <Catalogue>
      <Header>
        <Row gap="1rem" align="center">
          <H3>Messages</H3>
          {number > 0 && <Number number={number} white>{number}</Number>}
        </Row>
        <Text>+ New chat</Text>
      </Header>
      <SearchBar/>
      <ChatsList/>
    </Catalogue>
  );
};

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

interface NumberProps {
  number: number;
}

const Number = styled(Text)<NumberProps>`
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.palette.warning.light};
  border-radius: 50px;
  
  ${({number}) => css`
    width: ${number.toString().length + 1}rem;
    height: 2rem;
  `}
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
    <List gap="2rem">
      {dialogs && [...dialogs]
        .sort((a, b) =>
          +new Date(a.lastMessage.createdAt) - +new Date(b.lastMessage.createdAt))

        .filter(({companion}) =>
          companion.firstName.toLowerCase().startsWith(search.toLowerCase()))

        .map(({id, companion, lastMessage, unreadMessagesNumber}) => {
          const isOwn = lastMessage.sender.id === credentials!.id;
          const text = transformMessageToText({message: lastMessage, isOwn});
          const selected = companion.id === companionId;

          const info = isOwn ? (
            <Icon gray={!selected} name={lastMessage.isRead ? "double-check" : "check"}/>
          ) : unreadMessagesNumber > 0 && (
            <Number number={unreadMessagesNumber} white>{unreadMessagesNumber}</Number>
          );

          return (
            <Item key={id} companion={companion} text={text} selected={selected}
                  date={new Date(lastMessage.createdAt)} info={info}
            />
          );
        })}
    </List>
  );
};

const List = styled(Col)`
  width: 100%;
`;

interface ItemProps {
  text: string;
  companion: IUser;
  date: Date;
  selected: boolean;
  info: React.ReactNode;
}

const Item: React.FC<ItemProps> = ({text, companion, date, info, selected}) => (
  <ChatLink to={`/${companion.id}`}>
    <ItemWrapper blue={selected}>
      <CompanionAvatar>
        <Avatar src={companion.avatar}/>
      </CompanionAvatar>

      <ItemContent>
        <UserName space="nowrap">{companion.firstName}</UserName>
        <Text space="nowrap" white={selected}>{text}</Text>
      </ItemContent>

      <ItemInfo>
        <Text white={selected}>{format(date, "HH:mm")}</Text>

        {info}
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

const CompanionAvatar = styled.div`
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
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  width: calc(30% - 65px);
  padding: 1rem 0;
`;

const ChatLink = styled(Link)`
  text-decoration: none;
`;
