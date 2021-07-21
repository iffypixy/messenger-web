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
  min-width: 7rem;
  min-height: 7rem;
  width: 7rem;
  height: 7rem;
  
  
  ${({small}) => small && css`
    min-width: 5.5rem;
    min-height: 5.5rem;
    width: 5.5rem;
    height: 5.5rem;
  `}
`;

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;