import styled from "styled-components";

import {Text} from "./text";

interface Props {
  digits: number;
}

export const RoundedNumber = styled(Text)<Props>`
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({digits}) => `${digits + 1}rem`};
  height: 2rem;
  background-color: ${({theme}) => theme.palette.warning.light};
  border-radius: 50px;
`;