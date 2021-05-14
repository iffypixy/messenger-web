import * as React from "react";
import styled from "styled-components";

import {Row, Col} from "@lib/layout";
import {Icon, H1} from "@ui/atoms";
import {MainTemplate} from "@ui/templates";

export const AuthTemplate: React.FC = ({children}) => (
    <MainTemplate>
        <Wrapper>
            <Row basis="50%">
                <Representation />
            </Row>

            <Row basis="50%">
                <FormBlock>
                    {children}
                </FormBlock>
            </Row>
        </Wrapper>
    </MainTemplate>
);

const Representation: React.FC = () => (
    <Presentation>
        <Col width="70%" justify="space-between">
            <Row justify="center">
                <Icon name="logo" />
            </Row>

            <Row>
                <H1 align="center">Be part of our awesome team and have fun with us</H1>
            </Row>

            <Row justify="center">
                <Icon name="rocket" />
            </Row>
        </Col>
    </Presentation>
);

const Presentation = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: ${({theme}) => theme.palette.secondary.main};
    padding: 3% 0 15%;
`;

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
`;

const FormBlock = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: ${({theme}) => theme.palette.primary.dark};
    padding: 3% 0 15%;
`;