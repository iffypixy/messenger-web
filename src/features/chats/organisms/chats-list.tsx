import React from "react";
import styled from "styled-components";

import {Col} from "@lib/layout";
import {Text, Circle} from "@ui/atoms";
import {Avatar} from "@ui/molecules";
import {getMessageDate} from "../lib/calculate-message";

export const ChatsList: React.FC = () => {
  const url = "https://sun2.tele2-kz-astana.userapi.com/s/v1/if1/VpOjpqMZ2C4amcZ6MDkVlpXWLmXA7w48zoA-ZhocNqd1yRx7FvU5N7c3oWnIC2yaOUZjhVnj.jpg?size=50x0&quality=96&crop=0,210,990,990&ava=1";

  return (
    <List>
      <ChatsListItem avatar={url}
                     name="Iman Aliev"
                     message="How u doing?"
                     date={new Date(2021, 4, 17, 23, 34, 12)}/>

      <ChatsListItem avatar={url}
                     name="Iman Aliev"
                     message="How u doing?"
                     date={new Date(2021, 4, 10, 23, 34, 12)}/>

      <ChatsListItem avatar={url}
                     name="Iman Aliev"
                     message="How u doing?"
                     date={new Date(2021, 4, 10, 23, 34, 12)}/>

      <ChatsListItem avatar={url}
                     name="Iman Aliev"
                     message="How u doing?"
                     date={new Date(2021, 4, 10, 23, 34, 12)}/>

      <ChatsListItem avatar={url}
                     name="Iman Aliev"
                     message="How u doing?"
                     date={new Date(2021, 4, 10, 23, 34, 12)}/>

      <ChatsListItem avatar={url}
                     name="Iman Aliev"
                     message="How u doing?"
                     date={new Date(2021, 4, 10, 23, 34, 12)}/>

      <ChatsListItem avatar={url}
                     name="Iman Aliev"
                     message="How u doing?"
                     date={new Date(2021, 4, 10, 23, 34, 12)}/>
    </List>
  );
};

const List = styled(Col).attrs(() => ({
  gap: "2rem"
}))`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

interface ChatsListItemProps {
  avatar: string;
  name: string;
  message: string;
  date: Date;
}

const ChatsListItem: React.FC<ChatsListItemProps> = ({avatar, name, message, date}) => (
  <Wrapper>
    <Avatar url={avatar}/>

    <Content>
      <Header>
        <Text width="70%" ellipsis>{name}</Text>
        <DateTime secondary small>{getMessageDate(date)}</DateTime>
      </Header>

      <Footer>
        <Message>{message}</Message>
        <Warning>23</Warning>
      </Footer>
    </Content>
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({theme}) => theme.palette.primary.light};
  border-radius: 1rem;
  padding: 2rem;
`;

const Content = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 0;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Footer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DateTime = styled(Text)`
  font-weight: 500;
  margin-left: 1rem;
`;

const Message = styled(Text).attrs(() => ({
  width: "85%",
  ellipsis: true,
  secondary: true
}))`
  font-size: 1.4rem;
  font-weight: 500;
`;

const Warning = styled(Circle)`
  margin-left: 1rem;
`;