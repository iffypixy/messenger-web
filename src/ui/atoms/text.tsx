import styled, {css} from "styled-components";

interface Props {
    primary?: boolean;
    space?: "nowrap" | "pre-wrap";
    type?: "bold";
    transform?: "uppercase" | "lowercase" | "capitalize";
    small?: boolean;
}

export const Text = styled.span<Props>`
    ${({theme, primary, space, type, transform, small}) => css`
        color: ${primary ? theme.palette.text.primary : theme.palette.text.secondary};
        font-family: ${theme.typography.fontFamily};
        font-weight: ${type === "bold" ? theme.typography.fontWeight.medium : theme.typography.fontWeight.regular};
        font-size: ${type === "bold" ? theme.typography.fontSize : small ? "1.2rem" : "1.4rem"};
        white-space: ${space};
        text-transform: ${transform};
    `};
    
    text-overflow: ellipsis;
    overflow: hidden;
`;
