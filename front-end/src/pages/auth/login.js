import React from "react";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";

const Login = () => {
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

  const handleLogin = async (formValue, helpers) => {
    try {
      //   await CreateEmployee(formValue).then(() => {
      //     helpers.resetForm();
      //     toast.success("Employee created successfully");
      //   });
    } catch (err) {
      console.log("EMPLOYEE_ERROR ", err);
    }
  };

  return (
    <section className="flex items-center gap-8 h-screen overflow-hidden p-12 bg-background">
      <div className="w-1/2 space-y-8">
        <div className="w-7/12 mx-auto">
          <h1 className="text-2xl font-bold text-center">Login</h1>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form className="w-7/12 mx-auto">
            <section className="flex flex-col items-center justify-center space-y-4">
              <div className="w-full">
                <Field
                  className="block border border-primary rounded-3xl py-3 px-4 focus:outline-none w-full"
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
                  className="block border border-primary rounded-3xl py-3 px-4 focus:outline-none w-full"
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
              <button type="submit" className="bg-primary rounded-3xl w-full px-8 py-3 text-white">
                Login
              </button>
            </section>
          </Form>
        </Formik>
      </div>
      <div className="w-1/2">
        <section className="loginPage rounded-3xl w-9/12 flex items-center justify-center h-[90vh] p-4">
          <div className="bg-white text-white rounded p-4 md:bg-opacity-0 md:backdrop-filter md:backdrop-blur-lg">
            <div className="space-y-4">
              <h1 className="text-2xl text-center">Welcome Back</h1>
              <p className="text-sm text-center">
                If you forgot your password, please contact your system
                administrator for a password reset
              </p>
            </div>
          </div>
        </section>
        {/* <img
          className="h-[90vh] w-9/12 object-cover rounded-3xl"
          src="/images/dart.jpg"
          alt=""
        /> */}
      </div>
    </section>
  );
};

export default Login;
