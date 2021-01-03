import React from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";

import {H3, Input, Text, RoundedNumber} from "@ui/atoms";
import {useActions} from "@lib/hooks";
import {Row} from "@lib/layout";
import {chatDialogsSelectors} from "../features/dialogs";
import {ChatsList} from "./chats-list";
import * as actions from "../actions";
import * as selectors from "../selectors";

export const ChatsCatalogue: React.FC = () => {
  const dialogs = useSelector(chatDialogsSelectors.listSelector);

  const number = dialogs ? dialogs
    .reduce((previous, {unreadMessagesNumber: number}) => previous + number, 0) : 0;

  return (
    <Catalogue>
      <Header>
        <Row gap="1rem" align="center">
          <H3>Messages</H3>
          {!!number && <RoundedNumber digits={number} white>{number}</RoundedNumber>}
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

const SearchBar: React.FC = () => {
  const {setSearch} = useActions(actions);

  const search = useSelector(selectors.searchSelector);

  const handleChange = ({currentTarget}: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(currentTarget.value);
  };

  return (
    <Bar>
      <Input
        onChange={handleChange}
        width="100%"
        value={search}
        placeholder="Search chats"
      />
    </Bar>
  );
};

const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
`;

