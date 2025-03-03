import React, { useContext, useState } from "react";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { authContext } from "@/components/use-context";
import { useRouter } from "next/router";
import Link from "next/link";
import { GoEye, GoEyeClosed } from "react-icons/go";

const Login = () => {
  const [password, setPassword]= useState("password")
  const [loading, setLoading] = useState(false);
  const { loginUser, user } = useContext(authContext);
  console.log("USER_AUTH ",user);
  const router = useRouter();

  const passwordVisibilityToggle = () => {
    if(password === "password"){
      setPassword("text")
    }else{
      setPassword("password")
    }
  }

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("This is not a valid email")
      .required("Email is required!"),
    password: Yup.string()
      // .test(
      //   "len",
      //   "The password must be between 6 and 20 characters.",
      //   (val) =>
      //     !val || (val.toString().length >= 6 && val.toString().length <= 40)
      // )
      .required("Password is required!"),
  });

  const handleLogin = async (formValue, helpers) => {
    try {
      setLoading(true);
      await loginUser(formValue.email, formValue.password).then((res) => {
        console.log("LOGIN_RESPONSE ",res)
        helpers.resetForm();
        setLoading(false);
        // if(user?.role === 'patient'){
        //   router.push("/")
        // }else{
        //   router.push('/dashboard')
        // }
      });
    } catch (err) {
      setLoading(false);
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
                  className="block border border-gray rounded-xl text-sm py-2 px-4 focus:outline-none w-full"
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
                <div className="flex justify-between border border-gray rounded-xl items-center pr-2">
                  <Field
                    className="block text-sm py-2 rounded-xl px-4 focus:outline-none w-full"
                    type={password}
                    placeholder="Password"
                    name="password"
                  />
                  {password === "password" ? <GoEye onClick={passwordVisibilityToggle} className="cursor-pointer"/> : <GoEyeClosed onClick={passwordVisibilityToggle} className="cursor-pointer" />}
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-warning text-xs"
                />
              </div>
              <button
                type="submit"
                className="bg-primary w-full rounded-xl text-sm px-8 py-3 text-white"
              >
                {loading && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    ></path>
                  </svg>
                )}
                Login
              </button>
              <div className="flex gap-4">
                <p>Do you have an account ? </p>
                <span className="text-primary_light"><Link href="/auth/register"> SignUp </Link></span>
              </div>
            </section>
          </Form>
        </Formik>
      </div>
      <div className="md:block hidden w-1/2">
        <section className="loginPage rounded-3xl flex items-center h-[90vh] p-4">
          <div className="">
            <div className="space-y-4">
              <h1 className="text-2xl text-white uppercase">Welcome to</h1>
              <h1 className="uppercase text-white text-2xl border-b py-4 border-white">
                Make - Easy HMIS
              </h1>
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
