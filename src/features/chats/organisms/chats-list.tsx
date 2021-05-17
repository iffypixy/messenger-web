import React from "react";
import styled from "styled-components";
import format from "date-fns/format";

import {Row} from "@lib/layout";
import {Text} from "@ui/atoms";
import {Avatar} from "@ui/molecules";
import {CircleNumber} from "../atoms";

export const ChatsList: React.FC = () => {
  const url = "https://sun2.tele2-kz-astana.userapi.com/s/v1/if1/VpOjpqMZ2C4amcZ6MDkVlpXWLmXA7w48zoA-ZhocNqd1yRx7FvU5N7c3oWnIC2yaOUZjhVnj.jpg?size=50x0&quality=96&crop=0,210,990,990&ava=1";

  return (
    <div>
      <ChatsListItem avatar={url}
                     name="Iman Aliev"
                     message="How u doing?"
                     date={new Date(2021, 4, 10, 23, 34, 12)}/>
    </div>
  );
};

interface ChatsListItemProps {
  avatar: string;
  name: string;
  message: string;
  date: Date;
}

const ChatsListItem: React.FC<ChatsListItemProps> = ({avatar, name, message, date}) => {
  const days = Math.ceil((Date.now() - +date) / (1000 * 60 * 60 * 24));
  const scheme = days >= 3 ? "MM.dd.yyyy" : "HH:mm";

  return (
    <Wrapper>
      <Row width="75%" justify="space-between">
        <AvatarWrapper>
          <Avatar url={avatar}/>
        </AvatarWrapper>

        <TextBlock>
          <Text ellipsis>{name}</Text>
          <Message ellipsis secondary>{message}</Message>
        </TextBlock>
      </Row>

      <InfoBlock>
        <Text small>{format(date, scheme)}</Text>
        <CircleNumber>23</CircleNumber>
      </InfoBlock>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({theme}) => theme.palette.primary.light};
  border-radius: 1rem;
  padding: 2rem;
`;

const AvatarWrapper = styled.div`
  width: 20%;
`;

const TextBlock = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 0;
`;

const InfoBlock = styled.div`
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0.5rem 0;
`;

const Message = styled(Text)`
  font-size: 1.4rem;
`;