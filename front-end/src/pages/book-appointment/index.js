import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { bookAppointment } from "../../redux/service/appointment";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { getAllServices } from "@/redux/features/patients";
import { toast } from 'react-toastify'
import { useRouter } from "next/router";

const BookAppointment = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { services } = useSelector(({ patient }) => patient);


  const initialValues = {
    first_name: "",
    second_name: "",
    date_of_birth: "",
    gender: "",
    appointment_date_time: "",
    reason: "",
    service: null,
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("FirstName is required!"),
    second_name: Yup.string().required("Second Name is required!"),
    date_of_birth: Yup.string().required("Date is required!"),
    gender: Yup.string().required("Select gender!"),
    appointment_date_time: Yup.string().required("Date is required!"),
    reason: Yup.string().required("Provide a reason!"),
    service: Yup.number().required("Select a service!"),
  });

  const handleBookAppointment = async (formValue, helpers) => {
    console.log(formValue);
    try {
      const formData = {
        ...formValue,
        service: parseInt(formValue.service),
      };
      setLoading(true);
      await bookAppointment(formData).then(() => {
        helpers.resetForm();
        toast.success('Appointment Booked Successfully!')
        setLoading(false);
        router.push('/')
      });
    } catch (err) {
      toast.error(err)
      console.log("APPOINTMENT_ERROR ", err);
    }
  };

  useEffect(() => {
    dispatch(getAllServices());
  }, []);

  return (
    <section className="flex items-center gap-8 h-screen overflow-hidden">
      <div className="md:w-1/2 w-full space-y-8 px-4">
        <div className="w-7/12 mx-auto">
          <h1 className="text-2xl text-center">Book Appointment</h1>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleBookAppointment}
        >
          <Form className="md:w-9/12 w-full mx-auto">
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} className="space-y-4">
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
                    as="select"
                    className="block pr-9 border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
                    name="gender"
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </Field>

                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-warning text-xs"
                  />
                </div>
                <div className="w-full">
                  <Field
                    className="block border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
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
                  <Field
                    className="block border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
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
                  <Field
                    className="block border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
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

                <div className="w-full">
                  <Field
                    as="select"
                    className="block pr-9 border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
                    name="service"
                  >
                    <option value="">Select Service</option>
                    {services?.map((service) => (
                      <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="service"
                    component="div"
                    className="text-warning text-xs"
                  />
                </div>
              </Grid>
            </Grid>
            <div className="w-full my-4">
              <Field
                className="block border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
                as="textarea"
                placeholder="Reason"
                name="reason"
              />
              <ErrorMessage
                name="reason"
                component="div"
                className="text-warning text-xs"
              />
            </div>
            <button
              type="submit"
              className="bg-primary rounded-xl w-full px-8 py-3 text-white"
            >
              Book Appointment
            </button>
          </Form>
        </Formik>
      </div>
      <div className="md:block hidden w-1/2">
        <section className="loginPage rounded-2xl flex items-center justify-center p-4">
          <div className="text-white">
            <div className="space-y-4">
              <h1 className="text-2xl text-center">
                Welcome to Make Easy-HMIS
              </h1>
              <p className="text-sm text-center">We make Easy-HMIS</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default BookAppointment;
