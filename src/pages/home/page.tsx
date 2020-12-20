import React, { useEffect } from "react";
import styled from "styled-components";

import {ChatsCatalogue, ChatPanel} from "@features/chat";
import {MainTemplate} from "@ui/templates";
import {Navbar} from "@ui/organisms";
import {useActions} from "@lib/hooks";
import {chatDialogsActions} from "@features/chat/features/dialogs";

export const HomePage: React.FC = () => {
  const {fetchDialogs} = useActions(chatDialogsActions);

  useEffect(() => {
    fetchDialogs({skip: 0, take: 5});
  }, []); 

  return (
    <MainTemplate>
      <Wrapper>
        <Navbar />
        <ChatsCatalogue />
        <ChatPanel />
      </Wrapper>
    </MainTemplate>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
`;
