import React from "react";
import styled, {css} from "styled-components";

import {Col} from "@lib/layout";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

interface InputNativeProps {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, Props>(({error, label, ...props}, ref) => (
  <Col>
    {label && <Label>{label}</Label>}
    <InputNative error={!!error} ref={ref} {...props} />
    {error && <ErrorLabel>{error}</ErrorLabel>}
  </Col>
));

const InputNative = styled.input<InputNativeProps>`
    ${({theme}) => css`
      color: ${theme.palette.text.primary};
      font-size: ${theme.typography.fontSize};
      font-family: ${theme.typography.fontFamily};
      font-weight: ${theme.typography.fontWeight.regular};
      background-color: ${theme.palette.primary.main};
      
      &::placeholder {
        color: ${theme.palette.text.secondary};
      }
    `};
    
    border: ${({theme, error}) => error ? `1px solid ${theme.palette.error.main}` : "none"};
    border-radius: 5px;
    padding: 15px 20px;
`;

const Label = styled.label`
    ${({theme}) => css`
      color: ${theme.palette.text.primary};
      font-size: ${theme.typography.fontSize};
      font-family: ${theme.typography.fontFamily};
      font-weight: ${theme.typography.fontWeight.medium};
      text-transform: uppercase;
      margin-bottom: 15px;
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