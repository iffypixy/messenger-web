import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import styled from "styled-components";

import {ID} from "@lib/typings";
import {ChatsList, formatDate} from "@features/chats";
import {directsSelectors, directsActions} from "@features/directs";
import {groupsSelectors} from "@features/groups";
import {Col, Row} from "@lib/layout";
import {MainTemplate} from "@ui/templates";
import {H4, Icon, Input, Text} from "@ui/atoms";
import {Avatar} from "@ui/molecules";

export const DirectPage = () => {
  const dispatch = useDispatch();

  const directChats = useSelector(directsSelectors.chats);
  const areDirectChatsFetching = useSelector(directsSelectors.areChatsFetching);

  const groupChats = useSelector(groupsSelectors.chats);
  const areGroupChatsFetching = useSelector(groupsSelectors.areChatsFetching);

  const toFetchDirectChats = !directChats && !areDirectChatsFetching;
  const toFetchGroupChats = !groupChats && !areGroupChatsFetching;

  useEffect(() => {
    if (toFetchDirectChats) dispatch(directsActions.fetchChats());
    if (toFetchGroupChats) dispatch(directsActions.fetchChats());
  }, []);

  const {partnerId} = useParams<{partnerId: ID}>();

  const directChat = useSelector(directsSelectors.chat);
  const isDirectChatFetching = useSelector(directsSelectors.isChatFetching);

  const toFetchDirectChat = !directChat && !isDirectChatFetching;

  useEffect(() => {
    if (toFetchDirectChat) dispatch(directsActions.fetchChat({partnerId}));
  }, []);

  return (
    <MainTemplate>
      <Wrapper>
        <SidebarWrapper>
          <Sidebar>
            <Icon name="logo"/>
          </Sidebar>
        </SidebarWrapper>

        <ListPanelWrapper>
          <Col gap="3rem">
            <Row justify="space-between">
              <H4>Messages</H4>
              <Text clickable secondary>
                + Create new chat
              </Text>
            </Row>

            <SearchBar/>
          </Col>

          <ChatsList/>
        </ListPanelWrapper>

        <ChatPanelWrapper>
          <DirectChat/>
        </ChatPanelWrapper>
      </Wrapper>
    </MainTemplate>
  );
};

const SearchBar: React.FC = () => {
  const [text, setText] = useState("");

  return (
    <Input placeholder="Search chat"
           onChange={({currentTarget}) => setText(currentTarget.value)}
           value={text}/>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  background-color: ${({theme}) => theme.palette.primary.main};
`;

const SidebarWrapper = styled.aside`
  width: 10%;
  padding: 3rem 0 3rem 2rem;
`;

const Sidebar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({theme}) => theme.palette.primary.light};
  border-radius: 1rem;
  padding: 3rem 0;
`;

const ListPanelWrapper = styled(Col).attrs(() => ({
  gap: "3rem"
}))`
  width: 30%;
  height: 100%;
  padding: 4rem;
`;

const ChatPanelWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 100%;
  border-left: 2px solid ${({theme}) => theme.palette.divider};
`;

const DirectChat: React.FC = () => {
  const chat = useSelector(directsSelectors.chat);
  const isFetching = useSelector(directsSelectors.isChatFetching);

  if (isFetching) return <H4>Loading...</H4>;

  if (!chat) return null;

  return (
    <DirectWrapper>
      <DirectHeader>
        <Row justify="space-between">
          <Row gap="3rem" align="center">
            <Avatar url={chat.partner.avatar} />

            <Col justify="space-between">
              <H4>{chat.partner.username}</H4>
              <Text>Last seen at {formatDate(chat.partner.lastSeen)}</Text>
            </Col>
          </Row>

          <Row>
            <Icon name="loupe" />
            <Icon name="loupe" />
          </Row>
        </Row>


      </DirectHeader>

      <DirectMessagesList>

      </DirectMessagesList>

      <DirectFooter>

      </DirectFooter>
    </DirectWrapper>
  );
};

const DirectWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const DirectHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 3rem 4.5rem;
`;

const DirectMessagesList = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
`;

const DirectFooter = styled.div`
  width: 100%;
  display: flex;
`;