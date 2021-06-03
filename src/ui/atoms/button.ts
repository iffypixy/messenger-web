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
  
  ${({small}) => css`
    font-size: ${small && "1.2rem"};
    padding: ${small && "1rem 1.5rem"};
  `};
  
  ${({theme, danger}) => css`
    background-color: ${danger && theme.palette.error.main};
  `};
  
  ${({disabled}) => css`
    opacity: ${disabled && "0.4"};
    cursor: ${disabled && "not-allowed"};
  `};
  
  ${({pure}) => css`
    background: ${pure && "transparent"};
    padding: ${pure && "0"};
  `};
`;