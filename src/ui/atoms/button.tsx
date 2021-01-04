import styled, {css} from "styled-components";

interface Props {
  pure?: boolean;
}

export const Button = styled.button<Props>`
  ${({theme, disabled}) => css`
    color: ${theme.palette.text.primary};
    font-size: ${theme.typography.fontSize};
    font-family: ${theme.typography.fontFamily};
    font-weight: ${theme.typography.fontWeight.regular};
    background-color: ${theme.palette.secondary.main};
    opacity: ${disabled ? "0.4" : "1"};
    cursor: ${disabled ? "not-allowed" : "pointer"};
  `};
  
  border: none;
  outline: none;
  border-radius: 5px;
  padding: 15px 25px;
  
  ${({pure}) => pure && css`
    background: transparent;
    padding: 0;
  `};
`;
