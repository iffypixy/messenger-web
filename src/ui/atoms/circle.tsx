import styled from "styled-components";

export const Circle = styled.div`
  color: ${({theme}) => theme.palette.text.primary};
  font-size: 0.8rem;
  background-color: ${({theme}) => theme.palette.warning.main};
  border-radius: 50%;
  padding: 0.5rem;
`;