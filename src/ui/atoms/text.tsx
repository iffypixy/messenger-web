import React from "react";
import styled, {css} from "styled-components";

export const Text: React.FC = ({children}) => <Span>{children}</Span>;

const Span = styled.span`
    ${({theme}) => css`
        color: ${theme.palette.text.secondary};
        font-family: ${theme.typography.fontFamily};
        font-weight: ${theme.typography.fontWeight.regular};
        font-size: 1.4rem;
    `}
`;
