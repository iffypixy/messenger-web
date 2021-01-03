import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";

import {chatDialogsSelectors} from "@features/chat/features/dialogs";
import {Avatar, Button, Icon, Text, BoldText, Skeleton} from "@ui/atoms";

export const DialogHeader: React.FC = () => {
  const dialog = useSelector(chatDialogsSelectors.dialogSelector);
  const isCompanionFetching = useSelector(chatDialogsSelectors.isCompanionFetchingSelector);

  const companion = dialog?.companion;

  const info = dialog?.typing ? "typing..." : "Online/offline";

  return (
    <Header>
      <HeaderInfo>
        <HeaderAvatar>
          {isCompanionFetching ? <Skeleton.Image secondary /> : <Avatar src={companion?.avatar} />}
        </HeaderAvatar>

        <HeaderContent>
          {isCompanionFetching ? <Skeleton.Text width="15rem" secondary /> : <BoldText>{companion?.firstName}</BoldText>}
          {isCompanionFetching ? <Skeleton.Text width="10rem" secondary /> : <Text>{info}</Text>}
        </HeaderContent>
      </HeaderInfo>

      <HeaderOptions>
        <Button iconic>
          <Icon name="loupe" />
        </Button>

        <Button iconic>
          <Icon name="attachment" />
        </Button>
      </HeaderOptions>
    </Header>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-bottom: 2px solid ${({theme}) => theme.palette.divider};
  padding: 2rem;
`;

const HeaderInfo = styled.div`
  display: flex;
`;

const HeaderAvatar = styled.div`
  width: 6.5rem;
  height: 6.5rem;
`;

const HeaderContent = styled.div`
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