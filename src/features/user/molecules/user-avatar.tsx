import React from "react";
import styled from "styled-components";

import {User} from "@api/common";
import {Avatar} from "@ui/atoms";

interface Props {
  user: User;
}

export const UserAvatar: React.FC<Props> = ({user}) => (
  <Wrapper>
    <Avatar src={user.avatar} />
    {user.online && <Status />}
  </Wrapper>
);

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Status = styled.div`
  width: 1rem;
  height: 1rem;
  background-color: ${({theme}) => theme.palette.success.main};
  border-radius: 50%;
  border: 2px solid #FFFFFF;
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
`;