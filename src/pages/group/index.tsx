import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import styled from "styled-components";
import {nanoid} from "nanoid";
import {unwrapResult} from "@reduxjs/toolkit";

import {authSelectors} from "@features/auth";
import {ProfileModal} from "@features/profiles";
import {ChatForm, ChatsList, useFetchingChats, SearchBar, ChatMenu} from "@features/chats";
import {GroupCreationModal, GroupMessagesList, groupsActions, groupsSelectors} from "@features/groups";
import {ID} from "@lib/typings";
import {Col, Row} from "@lib/layout";
import {useRootDispatch} from "@lib/store";
import {Skeleton} from "@lib/skeleton";
import {H4, Icon, Text} from "@ui/atoms";
import {MainTemplate} from "@ui/templates";
import {Avatar} from "@ui/molecules";

export const GroupPage = () => {
  const dispatch = useRootDispatch();

  useFetchingChats();

  const {groupId} = useParams<{groupId: ID}>();

  const [isGroupCreationModalOpen, setIsGroupCreationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const credentials = useSelector(authSelectors.credentials)!;
  const chat = useSelector(groupsSelectors.chat(groupId));
  const messages = useSelector(groupsSelectors.messages(groupId));
  const isChatFetching = useSelector(groupsSelectors.isChatFetching(groupId));
  const areMessagesFetching = useSelector(groupsSelectors.areMessagesFetching(groupId));
  const areMessagesFetched = useSelector(groupsSelectors.areMessagesFetched(groupId));

  const toFetchChat = !chat && !isChatFetching;
  const toFetchMessages = !areMessagesFetched && !areMessagesFetching;

  useEffect(() => {
    if (toFetchChat) {
      dispatch(groupsActions.fetchChat({groupId}))
        .then(unwrapResult)
        .then(() => {
          if (toFetchMessages) {
            dispatch(groupsActions.fetchMessages({
              groupId, skip: messages.length
            }));
          }
        });
    }
  }, [groupId]);

  return (
    <>
      <GroupCreationModal
        isOpen={isGroupCreationModalOpen}
        onRequestClose={() => setIsGroupCreationModalOpen(false)}
        closeModal={() => setIsGroupCreationModalOpen(false)}/>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onRequestClose={() => setIsProfileModalOpen(false)}
        closeModal={() => setIsProfileModalOpen(false)}/>

      <MainTemplate>
        <Wrapper>
          <SidebarWrapper>
            <Sidebar>
              <Icon name="logo"/>

              <AvatarWrapper onClick={() => setIsProfileModalOpen(true)}>
                <Avatar url={credentials.avatar}/>
              </AvatarWrapper>
            </Sidebar>
          </SidebarWrapper>

          <ListPanelWrapper>
            <Col gap="3rem">
              <Row justify="space-between">
                <H4>Messages</H4>
                <Text
                  onClick={() => setIsGroupCreationModalOpen(true)}
                  clickable secondary>
                  + Create group chat
                </Text>
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
    </>
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

const Sidebar = styled(Col).attrs(() => ({
  width: "100%",
  height: "100%",
  align: "center",
  justify: "space-between",
  padding: "3rem 0"
}))`
  background-color: ${({theme}) => theme.palette.primary.light};
  border-radius: 1rem;
`;

const AvatarWrapper = styled.div`
  cursor: pointer;
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
  const isFetching = useSelector(groupsSelectors.isChatFetching(groupId));

  if (isFetching) return <GroupSkeleton/>;

  if (!chat) return null;

  return (
    <Col width="100%" height="100%">
      <Header>
        <Row width="100%" height="100%" justify="space-between" align="center">
          <Row height="100%" gap="3rem" align="center">
            <Avatar url={chat.avatar}/>

            <Col height="100%" justify="space-between" padding="1rem 0">
              <H4>{chat.title}</H4>
              <Text small>{chat.participants} members</Text>
            </Col>
          </Row>

          <Row>
            <ChatMenu>
              <ChatMenu.Item>Show attachments</ChatMenu.Item>
              <ChatMenu.Item>Leave group</ChatMenu.Item>
            </ChatMenu>
          </Row>
        </Row>
      </Header>

      <GroupMessagesList/>

      <ChatForm error={null} handleSubmit={({images, files, text, audio}) => {
        const id = nanoid();

        dispatch(groupsActions.addMessage({
          groupId,
          isOwn: true,
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
          text,
          parentId: null,
          groupId: chat.id,
          imagesIds: images && images.map(({id}) => id),
          filesIds: files && files.map(({id}) => id),
          audioId: audio && audio.id
        }))
          .then(unwrapResult)
          .then(({message}) => {
            dispatch(groupsActions.updateMessage({
              groupId,
              messageId: id,
              partial: message
            }));
          });
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

const GroupSkeleton: React.FC = () => (
  <Col width="100%" height="100%">
    <Header>
      <Row width="100%" height="100%" justify="space-between" align="center">
        <Row height="100%" gap="3rem" align="center">
          <Skeleton.Avatar/>

          <Col gap="1rem" height="100%" justify="space-between" padding="1rem 0">
            <Skeleton.Text width="20rem"/>
            <Skeleton.Text width="10rem"/>
          </Col>
        </Row>

        <Row>
          <Icon name="options" pointer/>
        </Row>
      </Row>
    </Header>

    <GroupMessagesList/>

    <ChatForm error={null} handleSubmit={() => null}/>
  </Col>
);