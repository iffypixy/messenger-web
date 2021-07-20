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
    font-size: ${theme.typography.fontSize};
    background-color: ${theme.palette.primary.light};
  `};
  
  opacity: 1;
  cursor: pointer;
  border: none;
  outline: none;
  border-radius: 0.5rem;
  padding: 1.5rem 2.5rem;
  
  ${({small}) => small && css`
    font-size: 1.2rem;
    padding: 1rem 1.5rem;
  `};
  
  ${({theme, danger}) => danger && css`
    background-color: ${theme.palette.error.main};
  `};
  
  ${({disabled}) => disabled && css`
    opacity: 0.4;
    cursor: not-allowed;
  `};
  
  ${({pure}) => pure && css`
    background: transparent;
    padding: 0;
  `};
`;