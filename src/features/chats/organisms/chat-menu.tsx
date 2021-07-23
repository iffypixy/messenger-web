import React, {HTMLAttributes} from "react";
import styled from "styled-components";

import {Col, Row} from "@lib/layout";
import {Text} from "@ui/atoms";

interface ChatMenuSubcomponents {
  Item: typeof ChatMenuItem;
}

export const ChatMenu: React.FC & ChatMenuSubcomponents = ({children}) => (
  <Menu>{children}</Menu>
);

interface ChatMenuItemProps extends HTMLAttributes<HTMLDivElement> {
}

const ChatMenuItem: React.FC<ChatMenuItemProps> = ({children, ...props}) => (
  <MenuItem {...props}>
    <MenuItemText>{children}</MenuItemText>
  </MenuItem>
);

ChatMenu.Item = ChatMenuItem;

const Menu = styled(Col)`
  width: 20rem;
  background-color: ${({theme}) => theme.palette.primary.main};
  border: 1px solid ${({theme}) => theme.palette.divider};
  border-radius: 0.5rem;
  position: absolute;
  top: 3rem;
  right: 2rem;
  visibility: hidden;
  opacity: 0;
  transition: 0.25s linear;
  padding: 1rem 0;
`;

const MenuItem = styled(Row)`
  cursor: pointer;
  padding: 1rem 2rem;
  
  &:hover {
    background-color: ${({theme}) => theme.palette.primary.light};
  }
`;

const MenuItemText = styled(Text)`
  font-size: 1.4rem;
`;