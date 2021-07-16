import styled, {css} from "styled-components";

interface SkeletonTextProps {
  width?: string;
}

const Text = styled.div<SkeletonTextProps>`
  ${({theme, width}) => css`
    width: ${width || "100%"};
    background-color: ${theme.palette.text.primary};
  `};
  
  height: 15px;
  border-radius: 5px;
`;

interface SkeletonAvatarProps {
  small?: boolean;
}

const Avatar = styled.div<SkeletonAvatarProps>`
  display: block;
  width: 7rem;
  height: 7rem;
  background-color: ${({theme}) => theme.palette.secondary.light};
  border-radius: 50%;
  
  ${({small}) => small && css`
    width: 4rem;
    height: 4rem;
  `};
`;

export const Skeleton = {Text, Avatar};