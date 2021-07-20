import React from "react";
import styled, {css} from "styled-components";
import {useHistory} from "react-router-dom";

import {Button} from "@ui/atoms";

interface AuthToggleButtonProps extends ToggleButtonProps {
    to: string;
}

export const AuthToggleButton: React.FC<AuthToggleButtonProps> = ({children, to, ...props}) => {
    const history = useHistory();

    return (
        <ToggleButton {...props} onClick={() => history.push(to)}>
            {children}
        </ToggleButton>
    );
};

interface ToggleButtonProps {
    active?: boolean;
}

const ToggleButton = styled(Button)<ToggleButtonProps>`
  ${({theme, active}) => css`
    background-color: ${active && theme.palette.secondary.light};
  `}
    
  &:first-child {
     border-bottom-right-radius: 0;
     border-top-right-radius: 0;
     border-bottom-left-radius: 15px;
     border-top-left-radius: 15px;
  }
    
  &:last-child {
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0; 
  }
`;