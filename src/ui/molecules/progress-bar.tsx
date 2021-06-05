import React from "react";
import styled from "styled-components";

import {Row} from "@lib/layout";

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({progress}) => (
  <Wrapper>
    <Bar progress={progress} />
  </Wrapper>
);

const Wrapper = styled(Row).attrs(() => ({
  width: "100%",
  height: "2rem",
  padding: "0 1rem",
  align: "center"
}))`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10rem;
`;

interface BarProps {
  progress: number;
}

const Bar = styled.div<BarProps>`
  width: ${({progress}) => `${progress * 100}%`};
  height: 1rem;
  box-shadow: 0 1rem 4rem -1rem #FFFFFF;
  border-radius: 10rem;
  background: #FFFFFF;
`;