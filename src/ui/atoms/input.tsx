import React, {InputHTMLAttributes, forwardRef} from "react";
import styled, {css} from "styled-components";

import {Col} from "@lib/layout";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
    error?: string;
    transparent?: boolean;
    small?: boolean;
    invisible?: boolean;
    secondary?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({error, label, name, width, small, ...props}, ref) => (
    <Wrapper width={width}>
        {label && <Label htmlFor={name}>{label}</Label>}
        <InputNative id={name} name={name} error={!!error} small={small} ref={ref} {...props} />
        {error && <ErrorLabel small={small}>{error}</ErrorLabel>}
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
    secondary?: boolean;
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
    
    ${({transparent}) => transparent && css`
      background-color: transparent;
    `};
    
    ${({small}) => small && css`
      font-size: 1.2rem;
      padding: 1.25rem 1.75rem;
    `};

    ${({theme, error}) => error && css`
      border: 2px solid ${theme.palette.error.main};
    `};
    
    ${({invisible}) => invisible && css`
      display: none;
    `};
    
    ${({theme, secondary}) => secondary && css`
      background-color: ${theme.palette.primary.main};
    `};
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

interface ErrorLabelProps {
    small?: boolean;
}

const ErrorLabel = styled.span<ErrorLabelProps>`
    ${({theme}) => css`
      color: ${theme.palette.error.main};
      font-family: ${theme.typography.fontFamily};
      font-weight: ${theme.typography.fontWeight.medium};
      font-size: ${theme.typography.fontSize};
    `};
    
    margin-top: 15px;
    
    ${({small}) => small && css`
      font-size: 1.2rem;
    `} 
`;