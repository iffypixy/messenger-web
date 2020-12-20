import React from "react";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

import {authActions, AuthTemplate, AuthToggleButton} from "@features/auth";
import {Col, Row} from "@lib/layout";
import {Button, Input} from "@ui/atoms";
import {useActions} from "@lib/hooks";

export const RegisterPage: React.FC = () => (
  <AuthTemplate>
    <Col width="70%" justify="space-between">
      <Row width="100%" justify="flex-end">
        <AuthToggleButton to="/login">Sign in</AuthToggleButton>
        <AuthToggleButton to="/register" active>Sign up</AuthToggleButton>
      </Row>

      <RegisterForm/>
    </Col>
  </AuthTemplate>
);

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  firstName: yup
    .string()
    .matches(/^[A-Za-z]*$/, "Enter a valid first name")
    .max(40, "First name is too long: should be at maximum 40 chars")
    .required("First name is required"),
  lastName: yup
    .string()
    .matches(/^[A-Za-z]*$/, "Enter a valid last name")
    .max(40, "Last name is too long: should be at maximum 40 chars")
    .required("Last name is required"),
  password: yup
    .string()
    .min(8, "Password is too short: should be at least 8 chars")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/, "Password should contain at least 1 letter and 1 number")
    .required("Password is required")
});

const RegisterForm: React.FC = () => {
  const {register, handleSubmit, errors, formState} = useForm({
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  const {fetchRegister} = useActions(authActions);

  return (
    <form onSubmit={handleSubmit(fetchRegister)}>
      <Col gap="60px">
        <Col gap="35px">
          <Input ref={register}
                 error={errors.firstName?.message}
                 name="firstName"
                 type="text"
                 label="First name"
                 placeholder="Juliana"/>
          <Input ref={register}
                 error={errors.lastName?.message}
                 name="lastName"
                 type="text"
                 label="Last name"
                 placeholder="Holland"/>
          <Input ref={register}
                 error={errors.email?.message}
                 name="email"
                 type="email"
                 label="Email"
                 placeholder="example@mail.ru"/>
          <Input ref={register}
                 error={errors.password?.message}
                 name="password"
                 type="password"
                 label="Password"
                 placeholder="x x x x x x x x"/>
        </Col>

        <Row>
          <Button disabled={!formState.isValid}>Sign up</Button>
        </Row>
      </Col>
    </form>
  );
};
