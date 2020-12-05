import React from "react";
import styled from "styled-components";

interface Props {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const MainTemplate: React.FC<Props> = ({children, header, footer}) => (
  <Template>
    {header && <Header>{header}</Header>}
    <main>{children}</main>
    {footer && <footer>{footer}</footer>}
  </Template>
);

const Template = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
`;

const Header = styled.header`
  z-index: 100;
`;