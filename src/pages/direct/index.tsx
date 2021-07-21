import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {useParams, useHistory} from "react-router-dom";
import styled from "styled-components";
import {nanoid} from "nanoid";
import {unwrapResult} from "@reduxjs/toolkit";

import {authSelectors} from "@features/auth";
import {ChatsList, formatMessageDate, ChatForm, useFetchingChats, SearchBar, ChatMenu} from "@features/chats";
import {directsSelectors, directsActions, DirectMessagesList, DirectAttachmentsModal} from "@features/directs";
import {GroupCreationModal} from "@features/groups";
import {ProfileModal} from "@features/profiles";
import {Col, Row} from "@lib/layout";
import {ID} from "@lib/typings";
import {useModal} from "@lib/modal";
import {useRootDispatch} from "@lib/store";
import {Skeleton} from "@lib/skeleton";
import {H4, Icon, Text} from "@ui/atoms";
import {Avatar} from "@ui/molecules";
import {MainTemplate} from "@ui/templates";

export const DirectPage = () => {
  const dispatch = useRootDispatch();

  useFetchingChats();

  const {partnerId} = useParams<{partnerId: ID}>();

  const {closeModal: closeGroupCreationModal, isModalOpen: isGroupCreationModalOpen, openModal: openGroupCreationModal} = useModal();
  const {closeModal: closeProfileModal, isModalOpen: isProfileModalOpen, openModal: openProfileModal} = useModal();

  const history = useHistory();

  const credentials = useSelector(authSelectors.credentials)!;
  const chat = useSelector(directsSelectors.chat(partnerId));
  const messages = useSelector(directsSelectors.messages(partnerId));
  const areMessagesFetching = useSelector(directsSelectors.areMessagesFetching(partnerId));
  const areMessagesFetched = useSelector(directsSelectors.areMessagesFetched(partnerId));
  const isChatFetching = useSelector(directsSelectors.isChatFetching(partnerId));

  const toFetchChat = !chat && !isChatFetching;
  const toFetchMessages = !areMessagesFetched && !areMessagesFetching;

  const isOwn = credentials.id === partnerId;

  useEffect(() => {
    if (isOwn) history.push("/");

    if (toFetchChat && !isOwn) {
      dispatch(directsActions.fetchChat({partnerId}))
        .then(unwrapResult)
        .then(() => {
          if (toFetchMessages) {
            dispatch(directsActions.fetchMessages({
              partnerId, skip: messages.length
            }));
          }
        });
    }
  }, [partnerId]);

  return (
    <>
      {isGroupCreationModalOpen && <GroupCreationModal closeModal={closeGroupCreationModal}/>}
      {isProfileModalOpen && <ProfileModal closeModal={closeProfileModal}/>}

      <MainTemplate>
        <Wrapper>
          <SidebarWrapper>
            <Sidebar>
              <Icon name="logo"/>

              <AvatarWrapper onClick={openProfileModal}>
                <Avatar url={credentials.avatar}/>
              </AvatarWrapper>
            </Sidebar>
          </SidebarWrapper>

          <ListPanelWrapper>
            <Col gap="3rem">
              <Row justify="space-between">
                <H4>Messages</H4>
                <Text
                  onClick={openGroupCreationModal}
                  clickable secondary>
                  + Create group chat
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
  justify: "space-between"
}))`
  background-color: ${({theme}) => theme.palette.primary.light};
  border-radius: 1rem;
  padding: 3rem 0;
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

const DirectChat: React.FC = () => {
  const dispatch = useRootDispatch();

  const {closeModal, openModal, isModalOpen} = useModal();

  const {partnerId} = useParams<{partnerId: ID}>();

  const credentials = useSelector(authSelectors.credentials)!;
  const chat = useSelector(directsSelectors.chat(partnerId))!;
  const isFetching = useSelector(directsSelectors.isChatFetching(partnerId));

  if (isFetching) return <DirectSkeleton/>;

  if (!chat) return null;

  const handleBanningPartner = () => {
    dispatch(directsActions.fetchBanningPartner({partnerId}));

    dispatch(directsActions.setDirect({
      partnerId, direct: {
        ...chat, partner: {
          ...chat.partner, isBanned: true
        }
      }
    }));
  };

  const handleUnbanningPartner = () => {
    dispatch(directsActions.fetchUnbanningPartner({partnerId}));

    dispatch(directsActions.setDirect({
      partnerId, direct: {
        ...chat, partner: {
          ...chat.partner, isBanned: false
        }
      }
    }));
  };

  const formError =
    chat.isBanned ? "Partner has blocked you, so you can not send message." :
      chat.partner.isBanned ? "You have blocked partner. Unblock to send message." : null;

  return (
    <>
      {isModalOpen && <DirectAttachmentsModal closeModal={closeModal}/>}

      <Col width="100%" height="100%">
        <Header>
          <Row width="100%" height="100%" justify="space-between" align="center">
            <Row height="100%" gap="3rem" align="center">
              <Avatar url={chat.partner.avatar}/>

              <Col height="100%" justify="space-between" padding="1rem 0">
                <H4>{chat.partner.username}</H4>
                <Text small>Last seen at {formatMessageDate(new Date(chat.partner.lastSeen))}</Text>
              </Col>
            </Row>

            <Row>
              <MenuWrapper>
                <Icon name="options" pointer/>
                <ChatMenu>
                  <ChatMenu.Item onClick={openModal}>Show attachments</ChatMenu.Item>
                  {chat.partner.isBanned ?
                    <ChatMenu.Item onClick={handleUnbanningPartner}>Unblock partner</ChatMenu.Item> :
                    <ChatMenu.Item onClick={handleBanningPartner}>Block partner</ChatMenu.Item>}
                </ChatMenu>
              </MenuWrapper>
            </Row>
          </Row>
        </Header>

        <DirectMessagesList/>

        <ChatForm error={formError} handleSubmit={
          ({images, files, text, audio}) => {
            const id = nanoid();

            const date = new Date();

            dispatch(directsActions.addMessage({
              partnerId, chat,
              isOwn: true,
              message: {
                id, files, text,
                chat: chat.details,
                sender: {...credentials, isBanned: chat.isBanned},
                audio: audio && audio.url,
                images: images && images.map(({url}) => url),
                isSystem: false,
                isRead: false,
                isEdited: false,
                parent: null,
                createdAt: date.toString()
              }
            }));

            dispatch(directsActions.fetchSendingMessage({
              text,
              parentId: null,
              partnerId: chat.partner.id,
              imagesIds: images && images.map(({id}) => id),
              filesIds: files && files.map(({id}) => id),
              audioId: audio && audio.id
            })).then(unwrapResult)
              .then(({message}) => {
                dispatch(directsActions.updateMessage({
                  partnerId,
                  messageId: id,
                  partial: message
                }));
              });
          }}/>
      </Col>
    </>
  );
};

const Header = styled(Row).attrs(() => ({
  width: "100%",
  align: "center",
  padding: "3rem 4.5rem"
}))`
  border-bottom: 2px solid ${({theme}) => theme.palette.divider};
`;

const MenuWrapper = styled.div`
  display: inline-flex;
  position: relative;
  
  &:hover > div {
    visibility: visible;
    opacity: 1;
  }
`;

const DirectSkeleton: React.FC = () => (
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

    <DirectMessagesList/>

    <ChatForm error={null} handleSubmit={() => null}/>
  </Col>
);