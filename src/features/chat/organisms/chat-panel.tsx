import React from "react";
import styled from "styled-components";

import {Text, Icon, IconButton} from "@ui/atoms";
import {UserAvatar, UserName} from "@features/user";
import {MessageForm} from "./message-form";

export const ChatPanel: React.FC = () => (
  <Panel>
    <PanelHeader />
    <div style={{display: "flex", flexGrow: 1}}></div>
    <MessageForm />
  </Panel>
);

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  width: 55%;
  height: 100%;
  background-color: ${({theme}) => theme.palette.primary.dark};
  border-left: 2px solid ${({theme}) => theme.palette.divider};
`;

const PanelHeader: React.FC = () => (
  <Header>
    <CompanionInfo>
      <CompanionAvatarWrapper>
        <UserAvatar src="https://cdn.dribbble.com/users/4255850/avatars/small/81daef4e2e469354c634e9c2b7bff9c2.jpg?1571229881" />
      </CompanionAvatarWrapper>

      <CompanionInfoContent>
        <UserName>Danny</UserName>
        <Text>Been online for 20 minutes</Text>
      </CompanionInfoContent>
    </CompanionInfo>

    <HeaderOptions>
      <IconButton>
        <Icon name="loupe" />
      </IconButton>

      <IconButton>
        <Icon name="attachment" />
      </IconButton>
    </HeaderOptions>
  </Header>
);

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-bottom: 2px solid ${({theme}) => theme.palette.divider};
  padding: 2rem;
`;
const CompanionInfo = styled.div`
  display: flex;
`;

const CompanionAvatarWrapper = styled.div`
  width: 65px;
  height: 65px;
`;

const CompanionInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 0 1rem 1.5rem;
`;

const HeaderOptions = styled.div`
  display: flex;
  align-items: center;

  & > :not(:first-child) {
    margin-left: 3rem;
  }
`;


