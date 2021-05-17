import React from "react";
import styled from "styled-components";

interface MainTemplateProps {
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

export const MainTemplate: React.FC<MainTemplateProps> = ({children, header, footer}) => (
    <Template>
        {header && <Header>{header}</Header>}
        <main>{children}</main>
        {footer && <footer>{footer}</footer>}
    </Template>
);

const Template = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Header = styled.header`
  z-index: 100;
`;