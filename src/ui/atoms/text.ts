import styled, {css} from "styled-components";

interface TextProps {
  clickable?: boolean;
}

export const Text = styled.span<TextProps>`
  ${({theme}) => css`
    color: ${theme.palette.text.secondary};
    font-family: ${theme.typography.fontFamily};
    font-weight: ${theme.typography.fontWeight.regular};
    font-size: ${theme.typography.fontSize};
  `};
  
  ${({clickable}) => css`
    cursor: ${clickable && "pointer"};
  `};
`;