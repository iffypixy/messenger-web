import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";

import {authSelectors} from "@features/auth";
import {directsActions, directsSelectors} from "@features/directs";
import {groupsActions, groupsSelectors, GroupCreationModal} from "@features/groups";
import {ProfileModal} from "@features/profiles";
import {ChatsList, SearchBar} from "@features/chats";
import {Col, Row} from "@lib/layout";
import {useRootDispatch} from "@lib/store";
import {Icon, H4, Text, H3} from "@ui/atoms";
import {MainTemplate} from "@ui/templates";
import {Avatar} from "@ui/molecules";

export const HomePage: React.FC = () => {
  const dispatch = useRootDispatch();

  const [isGroupCreationModalOpen, setIsGroupCreationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const credentials = useSelector(authSelectors.credentials)!;
  const directChats = useSelector(directsSelectors.chats);
  const areDirectChatsFetching = useSelector(directsSelectors.areChatsFetching);
  const groupChats = useSelector(groupsSelectors.chats);
  const areGroupChatsFetching = useSelector(groupsSelectors.areChatsFetching);

  const toFetchDirectChats = !directChats && !areDirectChatsFetching;
  const toFetchGroupChats = !groupChats && !areGroupChatsFetching;

  useEffect(() => {
    if (toFetchDirectChats) dispatch(directsActions.fetchChats());
    if (toFetchGroupChats) dispatch(groupsActions.fetchChats());
  }, []);

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
            <H3>Select chat to start messaging</H3>
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


