import React from "react";
import styled from "styled-components";

interface Props {
  progress: number;
}

export const ProgressBar: React.FC<Props> = (props) => (
  <Wrapper>
    <Progress {...props} />
  </Wrapper>
);

const Wrapper = styled.div`
  background-color: #2F334D;
  border-radius: 5px;
`;

const Progress = styled.div<Props>`
  width: ${({progress}) => progress}%;
  height: 0.8rem;
  border-radius: 5px;
  transition: 0.2s linear;
  transition-property: width, background-color;
  background-color: ${({theme}) => theme.palette.secondary.main};
`;