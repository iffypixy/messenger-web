import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import styled from "styled-components";
import {nanoid} from "nanoid";

import {ChatForm, ChatsList, MessagesList, useFetchingChats} from "@features/chats";
import {groupsActions, groupsSelectors} from "@features/groups";
import {ID} from "@lib/typings";
import {Col, Row} from "@lib/layout";
import {useRootDispatch} from "@lib/store";
import {H4, Icon, Input, Text} from "@ui/atoms";
import {MainTemplate} from "@ui/templates";
import {Avatar} from "@ui/molecules";

export const GroupPage = () => {
  const dispatch = useRootDispatch();

  useFetchingChats();

  const {groupId} = useParams<{groupId: ID}>();

  const chat = useSelector(groupsSelectors.chat(groupId));
  const messages = useSelector(groupsSelectors.messages(groupId));
  const isChatFetching = useSelector(groupsSelectors.isChatFetching(groupId));
  const areMessagesFetching = useSelector(groupsSelectors.areMessagesFetching(groupId));

  const toFetchMessages = !messages && !areMessagesFetching;
  const toFetchChat = !chat && !isChatFetching;

  useEffect(() => {
    if (toFetchChat) {
      dispatch(groupsActions.fetchChat({
        groupId, group: groupId
      }));
    }

    if (toFetchMessages) {
      dispatch(groupsActions.fetchMessages({
        groupId,
        group: groupId,
        skip: 0
      }));
    }
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
              <Text clickable secondary>+ Create new chat</Text>
            </Row>

            <SearchBar/>
          </Col>

          <ChatsList/>
        </ListPanelWrapper>

        <ChatPanelWrapper>
          <GroupChat/>
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

const GroupChat: React.FC = () => {
  const dispatch = useRootDispatch();

  const {groupId} = useParams<{groupId: ID}>();

  const chat = useSelector(groupsSelectors.chat(groupId));
  const messages = useSelector(groupsSelectors.messages((groupId)));
  const isFetching = useSelector(groupsSelectors.isChatFetching(groupId));
  const areMessagesFetching = useSelector(groupsSelectors.areMessagesFetching((groupId)));

  if (isFetching) return <H4>Loading...</H4>;

  if (!chat) return null;

  return (
    <Col width="100%" height="100%">
      <Header>
        <Row width="100%" height="100%" justify="space-between" align="center">
          <Row height="100%" gap="3rem" align="center">
            <Avatar url={chat.avatar}/>

            <Col height="100%" justify="space-between" padding="1rem 0">
              <H4>{chat.title}</H4>
              <Text small>{chat.numberOfMembers} members</Text>
            </Col>
          </Row>

          <Row gap="3rem">
            <Icon name="loupe" pointer/>
            <Icon name="options" pointer/>
          </Row>
        </Row>
      </Header>

      <MessagesList
        messages={messages}
        areFetching={areMessagesFetching} />

      <ChatForm handleSubmit={({images, files, text, audio}) => {
        const id = nanoid();

        dispatch(groupsActions.addMessage({
          groupId,
          message: {
            id, chat,
            files, audio: audio && audio.url,
            text, images: images && images.map(({url}) => url),
            sender: chat.member,
            isSystem: false,
            isEdited: false,
            isRead: false,
            parent: null,
            createdAt: new Date().toString()
          }
        }));

        dispatch(groupsActions.fetchSendingMessage({
          groupId,
          messageId: id,
          message: {
            images: images && images.map(({id}) => id),
            files: files && files.map(({id}) => id),
            audio: audio && audio.id, text,
            parent: null, group: chat.id
          }
        }));
      }}/>
    </Col>
  );
};

const Header = styled(Row).attrs(() => ({
  width: "100%",
  align: "center",
  padding: "3rem 4.5rem"
}))`
  border-bottom: 2px solid ${({theme}) => theme.palette.divider};
`;
