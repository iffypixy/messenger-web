import styled, {css} from "styled-components";

interface Props {
    white?: boolean;
}

export const Text = styled.span<Props>`
    ${({theme, white}) => css`
        color: ${white ? theme.palette.text.primary : theme.palette.text.secondary};
        font-family: ${theme.typography.fontFamily};
        font-weight: ${theme.typography.fontWeight.regular};
        font-size: 1.4rem;
    `}
`;
