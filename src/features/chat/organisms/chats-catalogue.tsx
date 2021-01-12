import React from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";

import {H3, Input, RoundedNumber, Button} from "@ui/atoms";
import {useActions, useModal} from "@lib/hooks";
import {Row} from "@lib/layout";
import {chatDialogsSelectors} from "../features/dialogs";
import {ChatsList} from "./chats-list";
import {NewChatModal} from "./new-chat-modal";
import * as actions from "../actions";
import * as selectors from "../selectors";

export const ChatsCatalogue: React.FC = () => {
  const {isModalOpen, openModal, closeModal} = useModal();

  const dialogs = useSelector(chatDialogsSelectors.listSelector);

  const number = dialogs?.reduce((prev, {unreadMessagesNumber: number}) => prev + number, 0) || 0;

  return (
    <>
      {isModalOpen && <NewChatModal closeModal={closeModal} />}

      <Catalogue>
        <Header>
          <Row gap="1rem" align="center">
            <H3>Messages</H3>
            {!!number && <RoundedNumber digits={number.toString().length} primary>{number}</RoundedNumber>}
          </Row>

          <NewChatButton onClick={openModal} pure>+ New chat</NewChatButton>
        </Header>

        <SearchBar/>

        <ChatsList/>
      </Catalogue>
    </>
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
    setSearch({search: currentTarget.value});
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

const NewChatButton = styled(Button)`
  color: ${({theme}) => theme.palette.text.secondary};
`;