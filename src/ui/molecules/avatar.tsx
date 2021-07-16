import React from "react";
import styled, {css} from "styled-components";

interface AvatarProps extends AvatarWrapperProps {
  url: string;
}

export const Avatar: React.FC<AvatarProps> = ({url, small}) => (
  <Wrapper small={small}>
    <Image src={url} alt="avatar"/>
  </Wrapper>
);

interface AvatarWrapperProps {
  small?: boolean;
}

const Wrapper = styled.div<AvatarWrapperProps>`
  width: 7rem;
  height: 7rem;
  
  ${({small}) => small && css`
    width: 4rem;
    height: 4rem;
  `}
`;

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;