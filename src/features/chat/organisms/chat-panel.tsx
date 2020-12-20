import React from "react";
import styled from "styled-components";

import {Text} from "@ui/atoms";

export const ChatPanel: React.FC = () => (
    <Panel>
        <Text>Chat panel</Text>
    </Panel>
);

const Panel = styled.div`
    display: flex;
    width: 55%;
    height: 100%;
    background-color: ${({theme}) => theme.palette.primary.dark};
    border-left: 2px solid ${({theme}) => theme.palette.divider};
`;