import React, {InputHTMLAttributes, forwardRef} from "react";
import styled, {css} from "styled-components";

import {Col} from "@lib/layout";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
    error?: string;
    transparent?: boolean;
    small?: boolean;
    invisible?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({error, label, name, width, ...props}, ref) => (
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
    invisible?: boolean;
}

const InputNative = styled.input<InputNativeProps>`
    ${({theme}) => css`
      color: ${theme.palette.text.primary};
      font-family: ${theme.typography.fontFamily};
      font-weight: ${theme.typography.fontWeight.regular};
      font-size: ${theme.typography.fontSize};
      background-color: ${theme.palette.primary.light};
      
      &::placeholder {
        color: ${theme.palette.text.secondary};
      }
    `};
    
    border: none;
    border-radius: 1rem;
    outline: none;
    padding: 1.5rem 2rem;
    
    ${({transparent}) => css`
      background-color: ${transparent && "transparent"};
    `};
    
    ${({small}) => css`
      font-size: ${small && "1.2rem"};
      padding: ${small && "1rem 1.5rem"};
    `};

    ${({theme, error}) => css`
      border: ${error && `2px solid ${theme.palette.error.main}`};
    `};
    
    ${({invisible}) => invisible && css`
      display: none;
    `}
`;

const Label = styled.label`
    ${({theme}) => css`
      color: ${theme.palette.text.primary};
      font-size: ${theme.typography.fontSize};
      font-family: ${theme.typography.fontFamily};
      font-weight: ${theme.typography.fontWeight.medium};
    `};
    
    display: flex;
    text-transform: uppercase;
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