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
        white-space: ${space};
    `};
    
    font-size: 1.4rem;
    text-overflow: ellipsis;
    overflow: hidden;
`;

export const BoldText = styled(Text)`
    ${({theme}) => css`
        color: ${theme.palette.text.primary};
        font-weight: ${theme.typography.fontWeight.medium};
        font-size: ${theme.typography.fontSize};
    `}
`;
