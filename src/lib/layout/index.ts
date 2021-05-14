import styled, {css} from "styled-components";

interface LayoutProps {
    width?: string | number;
    justify?: "flex-start" | "flex-end" | "center" | "space-around" | "space-between" | "space-evenly" | "safe center" | "unsafe center";
    align?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
    basis?: string | number;
    grow?: number;
    shrink?: number;
    order?: string | number;
    padding?: string | number;
    gap?: string | number;
    reverse?: boolean;
}

const mixins = (props: LayoutProps) => css`
  width: ${props.width};
  justify-content: ${props.justify};
  align-items: ${props.align};
  flex-basis: ${props.basis};
  flex-grow: ${props.grow};
  flex-shrink: ${props.shrink};
  order: ${props.order};
  padding: ${props.padding};
`;

export const Row = styled.div<LayoutProps>`
  display: flex;
  flex-direction: ${({reverse}) => reverse ? "row-reverse" : "row"};
  ${mixins};
  
  ${(props) =>
    props.gap && css`
          & > :not(:first-child) {
            margin-left: ${props.gap};
          }
  `}
`;

export const Col = styled.div<LayoutProps>`
  display: flex;
  flex-direction: ${({reverse}) => reverse ? "column-reverse" : "column"};
  ${mixins};
  
  ${(props) =>
    props.gap && css`
          & > :not(:first-child) {
            margin-top: ${props.gap};
          }
  `}
`;