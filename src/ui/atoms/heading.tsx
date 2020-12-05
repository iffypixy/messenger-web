import styled, {css} from "styled-components";

interface Props {
  align: "left" | "center" | "right";
}

const mixins = (props: Props) => css`
    text-align: ${props.align};
`;

export const H1 = styled.h1<Props>`
    ${({theme}) => css`
        color: ${theme.palette.text.primary};
        font-family: ${theme.typography.h1.fontFamily};
        font-weight: ${theme.typography.h1.fontWeight};
        font-size: ${theme.typography.h1.fontSize};
        letter-spacing: ${theme.typography.h1.letterSpacing};
        line-height: ${theme.typography.h1.lineHeight};
    `};
    
    ${mixins};
`;

export const H2 = styled.h2<Props>`
    ${({theme}) => css`
        color: ${theme.palette.text.primary};
        font-family: ${theme.typography.h2.fontFamily};
        font-weight: ${theme.typography.h2.fontWeight};
        font-size: ${theme.typography.h2.fontSize};
        letter-spacing: ${theme.typography.h2.letterSpacing};
        line-height: ${theme.typography.h2.lineHeight};
    `}
    
    ${mixins};
`;

export const H3 = styled.h3<Props>`
    ${({theme}) => css`
        color: ${theme.palette.text.primary};
        font-family: ${theme.typography.h3.fontFamily};
        font-weight: ${theme.typography.h3.fontWeight};
        font-size: ${theme.typography.h3.fontSize};
        letter-spacing: ${theme.typography.h3.letterSpacing};
        line-height: ${theme.typography.h3.lineHeight};
    `};
    
    ${mixins};
`;

export const H4 = styled.h4<Props>`
    ${({theme}) => css`
        color: ${theme.palette.text.primary};
        font-family: ${theme.typography.h4.fontFamily};
        font-weight: ${theme.typography.h4.fontWeight};
        font-size: ${theme.typography.h4.fontSize};
        letter-spacing: ${theme.typography.h4.letterSpacing};
        line-height: ${theme.typography.h4.lineHeight};
    `};
    
    ${mixins};
`;

export const H5 = styled.h5<Props>`
    ${({theme}) => css`
        color: ${theme.palette.text.primary};
        font-family: ${theme.typography.h5.fontFamily};
        font-weight: ${theme.typography.h5.fontWeight};
        font-size: ${theme.typography.h5.fontSize};
        letter-spacing: ${theme.typography.h5.letterSpacing};
        line-height: ${theme.typography.h5.lineHeight};
    `};
    
    ${mixins};
`;

export const H6 = styled.h6<Props>`
    ${({theme}) => css`
        color: ${theme.palette.text.primary};
        font-family: ${theme.typography.h6.fontFamily};
        font-weight: ${theme.typography.h6.fontWeight};
        font-size: ${theme.typography.h6.fontSize};
        letter-spacing: ${theme.typography.h6.letterSpacing};
        line-height: ${theme.typography.h6.lineHeight};
    `};
    
    ${mixins};
`;