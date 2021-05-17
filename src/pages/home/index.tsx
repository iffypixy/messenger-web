import React, {useState} from "react";
import styled from "styled-components";

import {ChatsList} from "@features/chats";
import {Icon, H4, Input, Text} from "@ui/atoms";
import {MainTemplate} from "@ui/templates";
import {Col, Row} from "@lib/layout";

export const HomePage: React.FC = () => {
  return (
    <MainTemplate>
      <Wrapper>
        <SidebarWrapper>
          <Sidebar>
            <Icon name="logo"/>
          </Sidebar>
        </SidebarWrapper>

        <ListPanelWrapper>
            <Col gap="5rem">
              <Row justify="space-between">
                <H4>Messages</H4>
                <Text clickable secondary>
                  + Create new chat
                </Text>
              </Row>

              <SearchBar/>
            </Col>

            <ChatsList />
        </ListPanelWrapper>

        <ChatPanelWrapper>

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
  gap: "4rem"
}))`
  width: 30%;
  height: 100%;
  padding: 4rem;
`;

const ChatPanelWrapper = styled.div`
  width: 60%;
  height: 100%;
  border-left: 2px solid ${({theme}) => theme.palette.divider};
`;

