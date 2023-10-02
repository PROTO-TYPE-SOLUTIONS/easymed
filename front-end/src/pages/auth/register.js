import React, { useContext } from "react";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { authContext } from "@/components/use-context";

const SignUp = () => {
  const { loginUser } = useContext(authContext)
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
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
  });

  const handleLogin = async (formValue,helpers) => {
    try {
      setLoading(true);
      await loginUser(formValue.email, formValue.password).then(() => {
        helpers.resetForm();
        setLoading(false);
      });
    } catch (err) {
      console.log("LOGIN_ERROR ", err);
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
          onSubmit={handleLogin}
        >
          <Form className="md:w-9/12 w-full mx-auto">
            <section className="flex flex-col items-center justify-center space-y-4">
              <div className="w-full">
                <Field
                  className="block border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
                  type="email"
                  placeholder="First Name"
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
                  type="email"
                  placeholder="Middle Name"
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
                  type="email"
                  placeholder="Last Name"
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
              <button type="submit" className="bg-primary rounded-xl w-full px-8 py-3 text-white">
                Login
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
