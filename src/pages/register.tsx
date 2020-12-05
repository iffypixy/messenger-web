import React from "react";
import {useForm} from "react-hook-form";
import Head from "next/Head";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

import {AuthTemplate, AuthToggleButton} from "@features/auth";
import {Col, Row} from "@lib/layout";
import {Button, Input} from "@ui/atoms";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const RegisterPage: React.FC = () => (
  <>
    <Head>
      <title>Messengram: the easiest way to communicate | Register</title>
    </Head>

    <AuthTemplate>
      <Col width="70%" justify="space-between">
        <Row width="100%" justify="flex-end">
          <AuthToggleButton href="/login">Sign in</AuthToggleButton>
          <AuthToggleButton href="/register" active>Sign up</AuthToggleButton>
        </Row>

        <RegisterForm/>
      </Col>
    </AuthTemplate>
  </>
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

  const onFormSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
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

export default RegisterPage;