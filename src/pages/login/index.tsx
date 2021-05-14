import * as React from "react";
import styled from "styled-components";
import {useDispatch} from "react-redux";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import yup from "yup";

import {AuthTemplate, AuthToggleButton, authActions} from "@features/auth";
import {Col, Row} from "@lib/layout";
import {Button, Input} from "@ui/atoms";

export const LoginPage: React.FC = () => (
    <AuthTemplate>
        <Col width="70%" justify="space-between">
            <Row width="100%" justify="flex-end">
                <AuthToggleButton to="/login" active>Sign in</AuthToggleButton>
                <AuthToggleButton to="/register">Sign up</AuthToggleButton>
            </Row>

            <LoginForm/>
        </Col>
    </AuthTemplate>
);

interface LoginForm {
    username: string;
    password: string;
}

const schema = yup.object().shape({
    email: yup.string()
        .required("Email is required"),
    password: yup.string()
        .required("Password is required")
});

const LoginForm: React.FC = () => {
    const dispatch = useDispatch();

    const {register, handleSubmit, formState: {errors, isValid}} = useForm<LoginForm>({
        resolver: yupResolver(schema),
        mode: "onChange"
    });

    return (
        <Form onSubmit={handleSubmit((data) => dispatch(authActions.fetchLogin(data)))}>
            <Col width="100%" gap="60px">
                <Col gap="35px">
                    <Input ref={register as React.Ref<HTMLInputElement>}
                           type="text"
                           name="username"
                           error={errors.username?.message}
                           label="Username"
                           placeholder="alex23"/>

                    <Input ref={register as React.Ref<HTMLInputElement>}
                           type="password"
                           name="password"
                           error={errors.password?.message}
                           label="Password"
                           placeholder="x x x x x x x x"/>
                </Col>

                <Row>
                    <Button disabled={!isValid} type="submit">Sign in</Button>
                </Row>
            </Col>
        </Form>
    );
};

const Form = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;