import React from "react";
import styled, {css} from "styled-components";

import {Text} from "@ui/atoms";

export const UserName = styled(Text)`
    ${({theme}) => css`
        color: ${theme.palette.text.primary};
        font-family: ${theme.typography.fontFamily};
        font-weight: ${theme.typography.fontWeight.medium};
        font-size: ${theme.typography.fontSize};
    `}
`;