import React from "react";
import styled from "styled-components";

import {Button, Icon, Text, Skeleton} from "@ui/atoms";

interface Props {
  title: string;
  subtitle: string;
  isFetching: boolean;
  avatar: React.ReactNode;
}

export const ChatHeader: React.FC<Props> = ({title, subtitle, isFetching, avatar}) => (
  <Header>
    <HeaderInfo>
      <HeaderAvatar>
        {isFetching ? <Skeleton.Avatar secondary/> : avatar}
      </HeaderAvatar>

      <HeaderContent>
        {isFetching ? <Skeleton.Text width="15rem" secondary/> :
          <Text type="bold" space="nowrap" primary>{title}</Text>}
        {isFetching ? <Skeleton.Text width="10rem" secondary/> : <Text space="nowrap">{subtitle}</Text>}
      </HeaderContent>
    </HeaderInfo>

    <HeaderOptions>
      <Button pure>
        <Icon name="loupe"/>
      </Button>

      <Button pure>
        <Icon name="attachment"/>
      </Button>
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

const HeaderInfo = styled.div`
  display: flex;
  width: 75%;
`;

const HeaderAvatar = styled.div`
  width: 6.5rem;
  height: 6.5rem;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 75%;
  padding: 1rem 0 1rem 1.5rem;
`;

const HeaderOptions = styled.div`
  display: flex;
  align-items: center;

  & > :not(:first-child) {
    margin-left: 3rem;
  }
`;