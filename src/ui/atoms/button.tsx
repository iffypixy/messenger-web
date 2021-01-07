import styled, {css} from "styled-components";

interface Props {
  pure?: boolean;
  danger?: boolean;
  small?: boolean;
}

export const Button = styled.button<Props>`
  ${({theme, disabled, pure, danger, small}) => css`
    color: ${theme.palette.text.primary};
    font-size: ${small ? "1.2rem" : theme.typography.fontSize};
    font-family: ${theme.typography.fontFamily};
    font-weight: ${theme.typography.fontWeight.regular};
    background-color: ${danger ? theme.palette.error.main : theme.palette.secondary.main};
    background: ${pure && "transparent"};
    opacity: ${disabled ? "0.4" : "1"};
    cursor: ${disabled ? "not-allowed" : "pointer"};
    padding: ${pure ? "0" : small ? "1rem 1.5rem" : "1.5rem 2.5rem"};
  `};
  
  border: none;
  outline: none;
  border-radius: 5px;
`;
