import * as React from "react";
import styled from "styled-components";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useDispatch} from "react-redux";

import {AuthTemplate, AuthToggleButton, authActions} from "@features/auth";
import {Col, Row} from "@lib/layout";
import {getFingerprint} from "@lib/fingerprint";
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

interface LoginFormInputs {
    username: string;
    password: string;
}

const schema = yup.object().shape({
    username: yup.string()
        .required("Username is required"),
    password: yup.string()
        .required("Password is required")
});

const LoginForm: React.FC = () => {
    const {register, handleSubmit, formState: {errors, isValid}} = useForm<LoginFormInputs>({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const dispatch = useDispatch();

    const onSubmit = async (data: LoginFormInputs) => {
        const fingerprint = await getFingerprint();

        dispatch(authActions.fetchLogin({
          ...data, fingerprint
        }));
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Col width="100%" gap="60px">
                <Col gap="35px">
                    <Input {...register("username")}
                           type="text"
                           name="username"
                           error={errors.username?.message}
                           label="Username"
                           placeholder="alex23"/>

                    <Input {...register("password")}
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