import styled, {css} from "styled-components";

export const Textarea = styled.textarea`
  ${({theme}) => css`
     color: ${theme.palette.text.primary};
     font-family: ${theme.typography.fontFamily};
     font-weight: ${theme.typography.fontWeight.regular};
     font-size: ${theme.typography.fontSize};
      
     &::placeholder {
       color: ${theme.palette.text.secondary};
     }
  `};

  width: 100%;
  height: 5rem;
  border: none;
  background: none;
  outline: none;
  resize: none;
  overflow: hidden;
  padding: 1.5rem 2rem;
`;