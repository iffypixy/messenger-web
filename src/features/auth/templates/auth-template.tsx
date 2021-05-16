import * as React from "react";
import styled from "styled-components";

import {Row, Col} from "@lib/layout";
import {Icon, H1} from "@ui/atoms";
import {MainTemplate} from "@ui/templates";

export const AuthTemplate: React.FC = ({children}) => (
    <MainTemplate>
        <Wrapper>
            <Representation />

            <FormBlock>{children}</FormBlock>
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
                <H1 align="center">Get in touch with people much easier than ever</H1>
            </Row>

            <Row justify="center">
                <Icon name="rocket" />
            </Row>
        </Col>
    </Presentation>
);

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
`;

const Presentation = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-basis: 50%;
    background-color: ${({theme}) => theme.palette.secondary.light};
    padding: 3% 0 15%;
    
    @media only screen and (max-width: ${({theme}) => theme.breakpoints.md}) {
      display: none;
    }
`;

const FormBlock = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    flex-basis: 50%;
    background-color: ${({theme}) => theme.palette.primary.main};
    padding: 3% 0 15%;
    
    @media only screen and (max-width: ${({theme}) => theme.breakpoints.md}) {
      flex-basis: 100%;
    }
`;