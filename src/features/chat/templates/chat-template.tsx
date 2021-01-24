import React from "react";
import styled from "styled-components";

import {ChatsCatalogue} from "@features/chat";
import {Navbar} from "@ui/organisms";
import {MainTemplate} from "@ui/templates";

export const ChatTemplate: React.FC = ({children}) => (
  <MainTemplate>
    <Wrapper>
      <Navbar/>
      <ChatsCatalogue/>
      <Panel>{children}</Panel>
    </Wrapper>
  </MainTemplate>
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
`;

const Panel = styled.div`
  width: 55%;
  height: 100%;
  display: flex;
  background-color: ${({theme}) => theme.palette.primary.dark};
  border-left: 2px solid ${({theme}) => theme.palette.divider};
`;
