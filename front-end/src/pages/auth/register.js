import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { registerUser } from "@/redux/service/auth";
import { useRouter } from "next/router";

const SignUp = () => {
  const [loading,setLoading] = useState(false);
  const router = useRouter();
  const initialValues = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "",
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .required("First Name is required!"),
    last_name: Yup.string()
      .required("Last Name is required!"),
    email: Yup.string()
      .email("This is not a valid email")
      .required("Email is required!"),
    password: Yup.string()
      .test(
        "len",
        "The password must be between 6 and 20 characters.",
        (val) =>
          !val || (val.toString().length >= 6 && val.toString().length <= 40)
      )
      .required("Password is required!"),
      role: Yup.string()
      .required("Role is required!"),
  });

  const handleRegister = async (formValue,helpers) => {
    try {
      setLoading(true);
      await registerUser(formValue).then(() => {
        helpers.resetForm();
        setLoading(false);
        router.push('/auth/login');
      });
    } catch (err) {
      console.log("SIGNUP_ERROR ", err);
    }
  };

  return (
    <section className="flex items-center gap-8 h-screen overflow-hidden">
      <div className="md:w-1/2 w-full space-y-8 px-4">
        <div className="w-7/12 mx-auto">
          <h1 className="text-2xl text-center">Create Account</h1>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          <Form className="md:w-9/12 w-full mx-auto">
            <section className="flex flex-col items-center justify-center space-y-4">
              <div className="w-full">
                <Field
                  className="block border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
                  type="text"
                  placeholder="First Name"
                  name="first_name"
                />
                <ErrorMessage
                  name="first_name"
                  component="div"
                  className="text-warning text-xs"
                />
              </div>
              <div className="w-full">
                <Field
                  className="block border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
                  type="text"
                  placeholder="Last Name"
                  name="last_name"
                />
                <ErrorMessage
                  name="last_name"
                  component="div"
                  className="text-warning text-xs"
                />
              </div>
              <div className="w-full">
                <Field
                  className="block border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
                  type="email"
                  placeholder="Email"
                  name="email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-warning text-xs"
                />
              </div>
              <div className="w-full">
                <Field
                  className="block border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
                  type="password"
                  placeholder="Password"
                  name="password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-warning text-xs"
                />
              </div>
              <div className="w-full">
                <Field
                  className="block border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
                  type="text"
                  placeholder="Role"
                  name="role"
                />
                <ErrorMessage
                  name="role"
                  component="div"
                  className="text-warning text-xs"
                />
              </div>
              <button type="submit" className="bg-primary rounded-xl w-full px-8 py-3 text-white">
                SignUp
              </button>
            </section>
          </Form>
        </Formik>
      </div>
      <div className="md:block hidden w-1/2">
        <section className="loginPage rounded-2xl flex items-center justify-center p-4">
          <div className="text-white">
            <div className="space-y-4">
              <h1 className="text-2xl text-center">Welcome to Make Easy-HMIS</h1>
              <p className="text-sm text-center">
                We make Easy-HMIS
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default SignUp;
