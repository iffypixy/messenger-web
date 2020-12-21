import React from "react";
import styled, {css} from "styled-components";

import {Col} from "@lib/layout";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: React.ReactNode;
  transparent?: boolean;
}

interface InputNativeProps {
  error?: boolean;
  transparent?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, Props>(({error, label, name, width, ...props}, ref) => (
  <Wrapper width={width}>
    {label && <Label htmlFor={name}>{label}</Label>}
    <InputNative id={name} name={name} error={!!error} ref={ref} {...props} />
    {error && <ErrorLabel>{error}</ErrorLabel>}
  </Wrapper>
));

const Wrapper = styled(Col)`
  & > :not(:first-child) {
    margin-top: 1.5rem;
  }

  & > [hidden] {
    margin-top: 0;
  }
`;

const InputNative = styled.input<InputNativeProps>`
    ${({theme, transparent}) => css`
      color: ${theme.palette.text.primary};
      font-size: ${theme.typography.fontSize};
      font-family: ${theme.typography.fontFamily};
      font-weight: ${theme.typography.fontWeight.regular};
      background-color: ${() => transparent ? "transparent" : theme.palette.primary.main};
      
      &::placeholder {
        color: ${theme.palette.text.secondary};
      }
    `};
    
    border: ${({theme, error}) => error ? `1px solid ${theme.palette.error.main}` : "none"};
    border-radius: 5px;
    outline: none;
    padding: 1.5rem 2rem;
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