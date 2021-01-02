import styled, {css} from "styled-components";

interface Props {
    white?: boolean;
    space?: "nowrap" | "pre-wrap";
}

export const Text = styled.span<Props>`
    ${({theme, white, space}) => css`
        color: ${white ? theme.palette.text.primary : theme.palette.text.secondary};
        font-family: ${theme.typography.fontFamily};
        font-weight: ${theme.typography.fontWeight.regular};
        font-size: 1.4rem;
        white-space: ${space};
        text-overflow: ellipsis;
        overflow: hidden;
    `}
`;
