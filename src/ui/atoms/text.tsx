import styled, {css} from "styled-components";

interface Props {
    primary?: boolean;
    space?: "nowrap" | "pre-wrap";
    type?: "bold";
    transform?: "uppercase" | "lowercase" | "capitalize";
    small?: boolean;
    rounded?: boolean;
    breakw?: "break-all" | "break-word" | "keep-all" | "normal";
    overflow?: "ellipsis" | "clip" | "fade" | "initial";
}

export const Text = styled.span<Props>`
    ${({theme, primary, space, type, transform, breakw, small, overflow}) => css`
        color: ${primary ? theme.palette.text.primary : theme.palette.text.secondary};
        font-family: ${theme.typography.fontFamily};
        font-weight: ${type === "bold" ? theme.typography.fontWeight.medium : theme.typography.fontWeight.regular};
        font-size: ${type === "bold" ? theme.typography.fontSize : small ? "1.2rem" : "1.4rem"};
        white-space: ${space};
        word-break: ${breakw};
        text-transform: ${transform};
        text-overflow: ${overflow || "initial"};
    `};
    
    overflow: hidden;
    
    ${({rounded}) => rounded && css`
        font-size: 1rem;
        font-weight: 700;
        background-color: ${({theme}) => theme.palette.warning.light};
        border-radius: 20px;
        padding: 0.4rem;
    `};
`;
