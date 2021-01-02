import styled, {css} from "styled-components";

interface Props {
  iconic?: boolean;
}

export const Button = styled.button<Props>`
  ${({theme}) => css`
    color: ${theme.palette.text.primary};
    font-size: ${theme.typography.fontSize};
    font-family: ${theme.typography.fontFamily};
    font-weight: ${theme.typography.fontWeight.regular};
    background-color: ${theme.palette.secondary.main};
  `};
  
  opacity: ${({disabled}) => disabled ? "0.4" : "1"};
  border: none;
  outline: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 15px 25px;
  
  ${({iconic}) => iconic && css`
    background: transparent;
    padding: 0;
  `};
`;
