import styled, {css} from "styled-components";

interface TextProps {
  clickable?: boolean;
  secondary?: boolean;
  ellipsis?: boolean;
  small?: boolean;
  width?: string;
}

export const Text = styled.span<TextProps>`
  ${({theme, width}) => css`
    color: ${theme.palette.text.primary};
    font-family: ${theme.typography.fontFamily};
    font-weight: ${theme.typography.fontWeight.regular};
    font-size: ${theme.typography.fontSize};
    width: ${width};
  `};
  
  ${({theme, secondary}) => css`
    color: ${secondary && theme.palette.text.secondary};
  `};
  
  ${({clickable}) => css`
    cursor: ${clickable && "pointer"};
  `};
  
  ${({ellipsis}) => ellipsis && css`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  `};
  
  ${({small}) => css`
    font-size: ${small && "1.2rem"};
  `};
`;