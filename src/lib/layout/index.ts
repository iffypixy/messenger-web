import styled, {css} from "styled-components";

interface LayoutProps {
    width?: string | number;
    height?: string | number;
    justify?: "flex-start" | "flex-end" | "center" | "space-around" | "space-between" | "space-evenly" | "safe center" | "unsafe center";
    align?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
    basis?: string | number;
    grow?: number;
    shrink?: number;
    order?: string | number;
    padding?: string | number;
    gap?: string | number;
    reverse?: boolean;
    wrap?: string;
}

const prop = (prop: any) => prop || "initial";

const mixins = (props: LayoutProps) => css`
  width: ${prop(props.width)};
  height: ${prop(props.height)};
  justify-content: ${prop(props.justify)};
  align-items: ${prop(props.align)};
  flex-basis: ${prop(props.basis)};
  flex-grow: ${prop(props.grow)};
  flex-wrap: ${prop(props.wrap)};
  flex-shrink: ${prop(props.shrink)};
  order: ${prop(props.order)};
  padding: ${prop(props.padding)};
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