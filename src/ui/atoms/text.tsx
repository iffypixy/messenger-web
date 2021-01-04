import styled, {css} from "styled-components";

interface Props {
    primary?: boolean;
    space?: "nowrap" | "pre-wrap";
    type?: "bold";
}

export const Text = styled.span<Props>`
    ${({theme, primary, space, type}) => css`
        color: ${primary ? theme.palette.text.primary : theme.palette.text.secondary};
        font-family: ${theme.typography.fontFamily};
        font-weight: ${type === "bold" ? theme.typography.fontWeight.medium : theme.typography.fontWeight.regular};
        font-size: ${theme.typography.fontSize};
        white-space: ${space};
    `};
    
    font-size: 1.4rem;
    text-overflow: ellipsis;
    overflow: hidden;
`;
