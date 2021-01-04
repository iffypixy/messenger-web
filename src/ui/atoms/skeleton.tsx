import React from "react";
import styled, {css} from "styled-components";

interface Props {
  secondary?: boolean;
}

interface TextProps extends Props {
  width?: string;
}

const Text = styled.div<TextProps>`
  ${({width, theme, secondary}) => css`
    width: ${width || "100%"};
    background: ${secondary ?
      theme.palette.primary.main :
      theme.palette.primary.dark};
  `};

  border-radius: 5px;
  height: 15px;
`;

const Avatar = styled.div<Props>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${({theme, secondary}) => secondary ?
    theme.palette.primary.main :
    theme.palette.primary.dark};
`;


export const Skeleton = {
  Text, Avatar
};
