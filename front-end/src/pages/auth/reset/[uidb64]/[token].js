import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { updatePassword } from "@/redux/service/auth";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { APP_API_URL } from "@/assets/api-endpoints";
import { useRouter } from "next/router";

const ChangePassword = () => {
  const router = useRouter();
  const { uidb64, token } = router.query;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validationSchema = Yup.object({
    password: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        passwordRegExp,
        "Password must have at least 1 capital letter, 1 number, and 1 symbol"
      ),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords do not match"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/customuser/password-reset/confirm/${uidb64}/${token}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: values.password }),
        }
      );
      if (response.ok) {
        toast.success("Password reset successfully!");
        resetForm();
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (error) {
      toast.error("Error resetting password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center gap-8 h-screen overflow-hidden">
      <div className="md:w-1/2 w-full space-y-8 px-4">
        <div className="w-7/12 mx-auto">
          <h1 className="text-xl text-center">Change Password</h1>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="md:w-9/12 w-full mx-auto">
              <section className="flex flex-col items-center justify-center space-y-4">
                <div className="w-full">
                  <div className="flex justify-between border border-gray rounded-xl items-center pr-2">
                    <Field
                      className="block text-sm py-2 rounded-xl px-4 focus:outline-none w-full"
                      type={passwordVisible ? "text" : "password"}
                      placeholder="New Password"
                      name="password"
                    />
                    {passwordVisible ? (
                      <GoEye onClick={togglePasswordVisibility} className="cursor-pointer" />
                    ) : (
                      <GoEyeClosed onClick={togglePasswordVisibility} className="cursor-pointer" />
                    )}
                  </div>
                  <ErrorMessage name="password" component="div" className="text-warning text-xs" />
                </div>
                <div className="w-full">
                  <div className="flex justify-between border border-gray rounded-xl items-center pr-2">
                    <Field
                      className="block text-sm py-2 rounded-xl px-4 focus:outline-none w-full"
                      type={confirmPasswordVisible ? "text" : "password"}
                      placeholder="Confirm Password"
                      name="confirmPassword"
                    />
                    {confirmPasswordVisible ? (
                      <GoEye onClick={toggleConfirmPasswordVisibility} className="cursor-pointer" />
                    ) : (
                      <GoEyeClosed onClick={toggleConfirmPasswordVisibility} className="cursor-pointer" />
                    )}
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="text-warning text-xs" />
                </div>
                <button type="submit" className="bg-primary w-full rounded-xl text-sm px-8 py-3 text-white" disabled={loading}>
                  {loading && <span className="animate-spin">🔄</span>} Reset
                </button>
              </section>
            </Form>
          )}
        </Formik>
      </div>
      <div className="md:block hidden w-1/2">
        <section className="loginPage h-screen rounded-2xl flex items-center justify-center p-4">
          <div className="text-white space-y-4">
            <h1 className="text-2xl text-center">Welcome to Make Easy-HMIS</h1>
            <p className="text-sm text-center">We make Easy-HMIS</p>
          </div>
        </section>
      </div>
    </section>
  );
};

export default ChangePassword;
