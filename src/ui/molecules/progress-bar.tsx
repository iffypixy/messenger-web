import styled from "styled-components";

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = styled.div<ProgressBarProps>`
  width: 100%;
  height: 0.5rem;
  border-radius: 1rem;
  background-color: ${({theme}) => theme.palette.text.primary};
  position: relative;

  div {
    width: ${({progress}) => `${progress}%`};
    height: 100%;
    border-radius: 1rem;
    transition: width 1s;
    background-color: ${({theme}) => theme.palette.secondary.light};
  }
`;