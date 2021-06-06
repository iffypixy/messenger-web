import React from "react";
import styled, {keyframes} from "styled-components";

export const Loader: React.FC = () => (
  <Wrapper>
    <div />
    <div />
    <div />
    <div />
  </Wrapper>
);

const spin = keyframes`
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
  width: 1rem;
  height: 1rem;
  
  > div {
    width: 2rem;
    height: 2rem;
    position: absolute;
    border: 0.25rem solid #fff;
    border-radius: 50%;
    animation: ${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
    
    &:nth-child(1) {
      animation-delay: -0.45s;
    }

    &:nth-child(2) {
      animation-delay: -0.3s;
    }
  
    &:nth-child(3) {
      animation-delay: -0.15s;
    }
  }
`;
