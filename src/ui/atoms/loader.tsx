import React, {HTMLAttributes} from "react";
import styled, {keyframes} from "styled-components";

interface Props extends HTMLAttributes<SVGElement> {
  name: "interwind";
}

const getLoader = ({name, ...props}: Props) => {
  switch (name) {
    case "interwind":
      const Interwind = styled.svg`
        display: block;
        shape-rendering: auto;
        width: 2rem;
        height: 2rem;
        margin: auto;
        
        circle {
          fill: ${({theme}) => theme.palette.primary.main};
        }
      `;

      return (
        <Interwind viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" {...props}>
          <g transform="translate(0 -18)">
            <circle cx="50" cy="28.400000000000002" r="10">
              <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 50;360 50 50"/>
              <animate attributeName="r" dur="1s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" values="0;36;0" keySplines="0.2 0 0.8 1;0.2 0 0.8 1"/>
            </circle>
            <circle cx="50" cy="28.400000000000002" r="10">
              <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="180 50 50;540 50 50"/>
              <animate attributeName="r" dur="1s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" values="36;0;36" keySplines="0.2 0 0.8 1;0.2 0 0.8 1"/>
            </circle>
          </g>
        </Interwind>
      );

    default:
      return null;
  }
};

export const Loader: React.FC<Props> = (props) => getLoader(props);