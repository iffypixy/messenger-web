import React from "react";
import styled, {css} from "styled-components";

export const UserName: React.FC = ({children}) => (
    <Name>{children}</Name>
);

const Name = styled.span`
    ${({theme}) => css`
        color: ${theme.palette.text.primary};
        font-family: ${theme.typography.fontFamily};
        font-weight: ${theme.typography.fontWeight.medium};
        font-size: ${theme.typography.fontSize};
    `}
`;