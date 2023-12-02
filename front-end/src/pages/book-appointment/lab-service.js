import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { bookAppointment } from "../../redux/service/appointment";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { getAllServices } from "@/redux/features/patients";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { publicLabRequest } from "@/redux/service/laboratory";
import { getAllLabTestProfiles } from "@/redux/features/laboratory";

const LabServiceForm = () => {
  const { services } = useSelector(({ patient }) => patient);
  const { labTestProfiles } = useSelector((store) => store.laboratory);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const initialValues = {
    first_name: "",
    second_name: "",
    date_of_birth: "",
    gender: "",
    appointment_date_time: "",
    status: "pending",
    reason: "",
    test_profile: "",
    lab_request: null,
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("FirstName is required!"),
    second_name: Yup.string().required("Second Name is required!"),
    date_of_birth: Yup.string().required("Date is required!"),
    gender: Yup.string().required("Select gender!"),
    appointment_date_time: Yup.string().required("Date is required!"),
    test_profile: Yup.string().required("Provide a test profile!"),
  });

  const handleLabRequest = async (formValue, helpers) => {
    console.log("FORM_VALUE ",formValue);
    try {
      setLoading(true);
      await publicLabRequest(formValue).then(() => {
        helpers.resetForm();
        toast.success(
          "Your request for Appointment has been received! We will send you an email confirmation."
        );
        setLoading(false);
        router.push("/");
      });
    } catch (err) {
      toast.error(err);
      setLoading(false);
      console.log("APPOINTMENT_ERROR ", err);
    }
  };


  useEffect(() => {
    dispatch(getAllServices());
    dispatch(getAllLabTestProfiles());
  }, []);

  return (
    <>
      <h1 className="text-2xl text-center">Lab Request</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLabRequest}
      >
        <Form className="md:w-9/12 w-full mx-auto">
          <Grid container spacing={2}>
            <Grid item md={6} xs={12} className="space-y-4">
              <div className="w-full">
                <label htmlFor="first_name">First Name</label>
                <Field
                  className="block border text-sm border-gray rounded-xl py-2 px-4 focus:outline-none w-full"
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
                <label htmlFor="gender">Gender</label>
                <Field
                  as="select"
                  className="block text-sm pr-9 border border-gray rounded-xl py-2 px-4 focus:outline-none w-full"
                  name="gender"
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </Field>

                <ErrorMessage
                  name="gender"
                  component="div"
                  className="text-warning text-xs"
                />
              </div>
              <div className="w-full">
                <label htmlFor="date_of_birth">Date of Birth</label>
                <Field
                  className="block text-sm border border-gray rounded-xl py-2 px-4 focus:outline-none w-full"
                  type="date"
                  placeholder="Date of birth"
                  name="date_of_birth"
                />
                <ErrorMessage
                  name="date_of_birth"
                  component="div"
                  className="text-warning text-xs"
                />
              </div>
            </Grid>
            <Grid item md={6} xs={12} className="space-y-4">
              <div className="w-full">
                <label htmlFor="second_name">Second Name</label>
                <Field
                  className="block border text-sm border-gray rounded-xl py-2 px-4 focus:outline-none w-full"
                  type="text"
                  placeholder="Second Name"
                  name="second_name"
                />
                <ErrorMessage
                  name="second_name"
                  component="div"
                  className="text-warning text-xs"
                />
              </div>

              <div className="w-full">
                <label htmlFor="appointment_date_time">Appointment Date</label>
                <Field
                  className="block border text-sm border-gray rounded-xl py-2 px-4 focus:outline-none w-full"
                  type="date"
                  placeholder="Appointment Date"
                  name="appointment_date_time"
                />
                <ErrorMessage
                  name="appointment_date_time"
                  component="div"
                  className="text-warning text-xs"
                />
              </div>
              <div>
                <label htmlFor="test_profile">Test Profile</label>
                <Field
                  as="select"
                  className="block text-sm pr-9 border border-gray rounded-xl py-2 px-4 focus:outline-none w-full"
                  name="test_profile"
                >
                  <option value="">Select Test Profile</option>
                  {labTestProfiles.map((test, index) => (
                    <option key={index} value="H">
                      {test?.name}
                    </option>
                  ))}
                </Field>

                <ErrorMessage
                  name="test_profile"
                  component="div"
                  className="text-warning text-xs"
                />
              </div>
            </Grid>
          </Grid>
          <div className="w-full my-4">
            <label htmlFor="reason">Upload Document</label>
            <Field
              className="block border border-gray rounded-xl text-sm py-3 px-4 focus:outline-none w-full"
              placeholder="Upload Document"
              type="file"
              name="lab_request"
            />
          </div>
          <div className="w-full my-4">
            <label htmlFor="reason">Reason</label>
            <Field
              className="block border border-gray rounded-xl text-sm py-3 px-4 focus:outline-none w-full"
              as="textarea"
              placeholder="Reason"
              name="reason"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-sm w-full rounded-xl px-8 py-2 text-white"
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
            Submit
          </button>
        </Form>
      </Formik>
    </>
  );
};

export default LabServiceForm;
