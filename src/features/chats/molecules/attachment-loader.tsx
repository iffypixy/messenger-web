import React from "react";
import styled from "styled-components";
import {Row} from "@lib/layout";

interface AttachmentLoaderProps {
  progress: number;
}

export const AttachmentLoader: React.FC<AttachmentLoaderProps> = ({progress}) => (
  <Wrapper>
    <Loader progress={progress} />
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

interface LoaderProps {
  progress: number;
}

const Loader = styled.div<LoaderProps>`
  width: ${({progress}) => `${progress * 100}%`};
  height: 1rem;
  box-shadow: 0 1rem 4rem -1rem #fff;
  border-radius: 10rem;
  background: #fff;
`;