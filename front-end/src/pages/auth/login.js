import React, { useContext,useState } from "react";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { authContext } from "@/components/use-context";
import { useRouter } from "next/router";

const Login = () => {
  const [loading,setLoading] = useState(false);
  const { loginUser } = useContext(authContext)
  const router = useRouter();
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
        // router.push('/dashboard')
      });
    } catch (err) {
      console.log("LOGIN_ERROR ", err);
    }
  };

  return (
    <section className="flex items-center gap-8 h-screen overflow-hidden">
      <div className="md:w-1/2 w-full space-y-8 px-4">
        <div className="w-7/12 mx-auto">
          <h1 className="text-2xl font-bold text-center">Login</h1>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form className="md:w-9/12 w-full mx-auto">
            <section className="flex flex-col items-center justify-center space-y-8">
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
        <section className="loginPage rounded-3xl flex items-center h-[90vh] p-4">
          <div className="">
            <div className="space-y-4">
              <h1 className="text-2xl text-white uppercase">Welcome to</h1>
              <h1 className="uppercase text-white text-2xl border-b py-4 border-white">Make - Easy HMIS</h1>
              <p className="text-sm text-white">
                If you forgot your password, please contact your system
                administrator for a password reset
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Login;
