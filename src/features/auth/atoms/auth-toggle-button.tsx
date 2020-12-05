import React, {ButtonHTMLAttributes} from "react";
import styled from "styled-components";
import Link from "next/link";

import {Button} from "@ui/atoms";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

interface Props extends ButtonProps {
  href: string;
}

export const AuthToggleButton: React.FC<Props> = ({children, href, ...props}) => (
  <Link href={href}>
    <ToggleButton {...props}>{children}</ToggleButton>
  </Link>
);

const ToggleButton = styled(Button)<ButtonProps>`
    background-color: ${({active, theme}) => active ? theme.palette.secondary.main : theme.palette.primary.main};
    
    &:first-child {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      border-bottom-left-radius: 15px;
      border-top-left-radius:15px;
    }
    
    &:last-child {
      border-bottom-right-radius: 15px;
      border-top-right-radius: 15px;
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
    }
`;