import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import styled from "styled-components";

import {authSelectors} from "@features/auth";
import {ChatsList, formatMessageDate, Message, SystemMessage} from "@features/chats";
import {directsSelectors, directsActions} from "@features/directs";
import {groupsSelectors} from "@features/groups";
import {Col, Row} from "@lib/layout";
import {ID} from "@lib/typings";
import {MainTemplate} from "@ui/templates";
import {H2, H4, Icon, Input, Text, Button} from "@ui/atoms";
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

  const directMessages = useSelector(directsSelectors.messages);
  const areDirectMessagesFetching = useSelector(directsSelectors.areMessagesFetching);

  const toFetchDirectMessages = !directMessages && !areDirectMessagesFetching;

  useEffect(() => {
    if (toFetchDirectChat) {
      dispatch(directsActions.fetchChat({
        partner: partnerId
      }));
    }

    if (toFetchDirectMessages) {
      dispatch(directsActions.fetchMessages({
        partner: partnerId,
        skip: "0" as unknown as number
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
  const messages = useSelector(directsSelectors.messages);
  const areMessagesFetching = useSelector(directsSelectors.areMessagesFetching);
  const credentials = useSelector(authSelectors.credentials)!;

  if (isFetching) return <H4>Loading...</H4>;

  if (!chat) return null;

  return (
    <Col width="100%" height="100%">
      <DirectHeader>
        <Row width="100%" height="100%" justify="space-between" align="center">
          <Row height="100%" gap="3rem" align="center">
            <Avatar url={chat.partner.avatar}/>

            <Col height="100%" justify="space-between" padding="1rem 0">
              <H4>{chat.partner.username}</H4>
              <Text small>Last seen at {formatMessageDate(new Date(chat.partner.lastSeen))}</Text>
            </Col>
          </Row>

          <Row gap="3rem">
            <Icon name="loupe" pointer/>
            <Icon name="options" pointer/>
          </Row>
        </Row>
      </DirectHeader>

      <DirectMessagesList>
        {areMessagesFetching && <H2>Loading...</H2>}

        {messages && messages.map(({id, isSystem, text, sender, createdAt, isRead, images, audio, files}) => {
          if (isSystem) return (
            <SystemMessage
              key={id}
              text={text}
              date={new Date(createdAt)}/>
          );

          const isOwn = !!(sender && sender.id === credentials.id);

          return (
            <Message
              key={id}
              text={text}
              images={images}
              audio={audio}
              files={files}
              avatar={sender!.avatar}
              date={new Date(createdAt)}
              isOwn={isOwn}
              isRead={isRead}/>
          );
        })}
      </DirectMessagesList>

      <Row width="100%" padding="2rem 5rem">
        <DirectFormWrapper>
          <Icon
            name="attachment"
            secondary pointer/>

          <Icon
            name="smile"
            secondary pointer/>

          <Input
            width="100%"
            placeholder="Write a message..."
            transparent/>

          <Icon
            name="microphone"
            secondary pointer/>

          <Button pure>
            <Icon name="telegram"/>
          </Button>

        </DirectFormWrapper>
      </Row>
    </Col>
  );
};

const DirectHeader = styled(Row).attrs(() => ({
  width: "100%",
  align: "center",
  padding: "3rem 4.5rem"
}))`
  border-bottom: 2px solid ${({theme}) => theme.palette.divider};
`;

const DirectMessagesList = styled(Col).attrs(() => ({
  width: "100%",
  padding: "1rem 5rem"
}))`
  flex: 1;
  overflow: auto;
`;

const DirectFormWrapper = styled(Row).attrs(() => ({
  width: "100%",
  align: "center",
  gap: "2rem",
  padding: "1rem 3rem"
}))`
  background-color: ${({theme}) => theme.palette.primary.light};
  border-radius: 1rem;
`;
