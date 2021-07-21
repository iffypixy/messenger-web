import React from "react";
import styled, {keyframes} from "styled-components";

export const Loader: React.FC = () => (
  <Wrapper>
    <div/>
    <div/>
    <div/>
    <div/>
  </Wrapper>
);

const ring = keyframes`
  0% {
    transform: rotate(0deg);
  }
  
  100% {
    transform: rotate(360deg);
  }
`;

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 4rem;
  height: 4rem;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 2.5rem;
    height: 2.5rem;
    margin: 0.5rem;
    border-width: 0.5rem;
    border-style: solid;
    border-radius: 50%;
    animation: ${ring} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #FFFFFF transparent transparent transparent;
  }
  
  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }
`;
