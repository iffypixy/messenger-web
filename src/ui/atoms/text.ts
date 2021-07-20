import styled, {css} from "styled-components";

interface TextProps {
  clickable?: boolean;
  secondary?: boolean;
  ellipsis?: boolean;
  small?: boolean;
  width?: string;
  uppercase?: boolean;
}

export const Text = styled.span<TextProps>`
  ${({theme, width}) => css`
    color: ${theme.palette.text.primary};
    font-family: ${theme.typography.fontFamily};
    font-weight: ${theme.typography.fontWeight.regular};
    font-size: ${theme.typography.fontSize};
    width: ${width};
  `};
  
  ${({theme, secondary}) => secondary && css`
    color: ${theme.palette.text.secondary};
  `};
  
  ${({clickable}) => clickable && css`
    cursor: pointer;
  `};
  
  ${({ellipsis}) => ellipsis && css`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  `};
  
  ${({small}) => small && css`
    font-size: 1.2rem;
  `};
  
  ${({uppercase}) => uppercase && css`
    text-transform: uppercase;
  `};
`;