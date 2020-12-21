import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import styled from "styled-components";

import {useActions} from "@lib/hooks";
import {MainTemplate} from "@ui/templates";
import {Navbar} from "@ui/organisms";
import {ChatsCatalogue, ChatPanel} from "@features/chat";
import {chatDialogsActions} from "@features/chat/features/dialogs";

export const ViewPage: React.FC = () => {
  const {fetchDialog, fetchMessages, setCurrentCompanionId} = useActions(chatDialogsActions);
  const {companionId} = useParams<{companionId: string}>();

  useEffect(() => {
    setCurrentCompanionId(companionId);
  }, [companionId]);

  useEffect(() => {
    fetchDialog({companionId});
    fetchMessages({companionId, take: 20, skip: 0});
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
