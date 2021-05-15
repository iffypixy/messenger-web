import styled, {css} from "styled-components";

interface ButtonProps {
    pure?: boolean;
    danger?: boolean;
    small?: boolean;
}

export const Button = styled.button<ButtonProps>`
  ${({theme}) => css`
    color: ${theme.palette.text.primary};
    font-family: ${theme.typography.fontFamily};
    font-weight: ${theme.typography.fontWeight.regular};
  `};
  
  ${({theme, small}) => css`
    font-size: ${small ? "1.2rem" : theme.typography.fontSize};
    padding: ${small ? "1rem 1.5rem" : "1.5rem 2.5rem"};
  `};
  
  ${({theme, danger}) => css`
    background-color: ${danger ? theme.palette.error.main : theme.palette.secondary.main};
  `};
  
  ${({disabled}) => css`
    opacity: ${disabled ? "0.4" : "1"};
    cursor: ${disabled ? "not-allowed" : "pointer"};
  `};
  
  ${({pure}) => css`
    background: ${pure && "transparent"};
    padding: ${pure && "0"};
  `};
  
  border: none;
  outline: none;
  border-radius: 5px;
`;