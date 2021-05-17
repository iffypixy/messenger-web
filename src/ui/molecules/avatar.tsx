import React from "react";
import styled from "styled-components";

interface AvatarProps {
  url: string;
}

export const Avatar: React.FC<AvatarProps> = ({url}) => (
  <Wrapper>
    <Image src={url} alt="avatar"/>
  </Wrapper>
);

const Wrapper = styled.div`
  width: 7rem;
  height: 7rem;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;