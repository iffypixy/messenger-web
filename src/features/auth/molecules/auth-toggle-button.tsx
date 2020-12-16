import React, {ButtonHTMLAttributes} from "react";
import styled from "styled-components";
import {useHistory} from "react-router-dom";

import {Button} from "@ui/atoms";

interface Props extends ButtonProps {
  to: string;
}

export const AuthToggleButton: React.FC<Props> = ({children, to, ...props}) => {
  const history = useHistory();

  const handleButtonClick = () => {
    history.push(to);
  };

  return <ToggleButton {...props} onClick={handleButtonClick}>{children}</ToggleButton>;
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

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