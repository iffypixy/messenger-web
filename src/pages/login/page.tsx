import React from "react";
import {useForm} from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

import {authActions, AuthTemplate, AuthToggleButton} from "@features/auth";
import {Col, Row} from "@lib/layout";
import {Button, Input} from "@ui/atoms";
import {useActions} from "@lib/hooks";

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

const schema = yup.object().shape({
  email: yup.string()
    .required("Email is required"),
  password: yup.string()
    .required("Password is required")
});

const LoginForm: React.FC = () => {
  const {register, handleSubmit, errors, formState} = useForm({
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  const {fetchLogin} = useActions(authActions);

  return (
    <Form onSubmit={handleSubmit(fetchLogin)}>
      <Col width="100%" gap="60px">
        <Col gap="35px">
          <Input ref={register}
                 type="text"
                 name="email"
                 error={errors.email?.message}
                 label="E-mail"
                 placeholder="example@mail.ru"/>

          <Input ref={register}
                 type="password"
                 name="password"
                 error={errors.password?.message}
                 label="Password"
                 placeholder="x x x x x x x x"/>
        </Col>

        <Row>
          <Button disabled={!formState.isValid} type="submit">Sign in</Button>
        </Row>
      </Col>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
