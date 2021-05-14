import * as React from "react";
import styled, {css} from "styled-components";

import {Col} from "@lib/layout";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
    error?: string;
    transparent?: boolean;
    small?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({error, label, name, width, ...props}, ref) => (
    <Wrapper width={width}>
        {label && <Label htmlFor={name}>{label}</Label>}
        <InputNative id={name} name={name} error={!!error} ref={ref} {...props} />
        {error && <ErrorLabel>{error}</ErrorLabel>}
    </Wrapper>
));

const Wrapper = styled(Col).attrs(() => ({
    gap: "1.5rem"
}))`  
  & > [hidden] {
    margin-top: 0;
  }
`;

interface InputNativeProps {
    error?: boolean;
    transparent?: boolean;
    small?: boolean;
}

const InputNative = styled.input<InputNativeProps>`
    ${({theme, transparent, small, error}) => css`
      color: ${theme.palette.text.primary};
      font-size: ${small ? "1.2rem" : theme.typography.fontSize};
      font-family: ${theme.typography.fontFamily};
      font-weight: ${theme.typography.fontWeight.regular};
      background-color: ${transparent ? "transparent" : theme.palette.primary.main};
      border: ${error ? `1px solid ${theme.palette.error.main}` : "none"};
      padding: ${small ? "1rem 1.5rem" : "1.5rem 2rem"};
      
      &::placeholder {
        color: ${theme.palette.text.secondary};
      };
    `};
    
    border-radius: 5px;
    outline: none;
`;

const Label = styled.label`
    ${({theme}) => css`
      color: ${theme.palette.text.primary};
      font-size: ${theme.typography.fontSize};
      font-family: ${theme.typography.fontFamily};
      font-weight: ${theme.typography.fontWeight.medium};
      text-transform: uppercase;
    `};
`;

const ErrorLabel = styled.span`
    ${({theme}) => css`
      color: ${theme.palette.error.main};
      font-family: ${theme.typography.fontFamily};
      font-weight: ${theme.typography.fontWeight.medium};
      font-size: ${theme.typography.fontSize};
    `};
    
    margin-top: 15px;
`;