import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";

import {UserName} from "@features/user";
import {chatDialogsSelectors} from "@features/chat/features/dialogs";
import {Avatar, Button, Icon, Text} from "@ui/atoms";

export const DialogHeader: React.FC = () => {
  const dialog = useSelector(chatDialogsSelectors.dialogSelector);

  const companion = dialog?.companion;

  return (
    <Header>
      <HeaderInfo>
        <HeaderAvatar>
          <Avatar src={companion?.avatar} />
        </HeaderAvatar>

        <HeaderContent>
          <UserName>{companion?.firstName}</UserName>
          <Text>Online/offline</Text>
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
  width: 65px;
  height: 65px;
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