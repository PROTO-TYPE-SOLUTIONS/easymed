import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { FormikValues, FormikHelpers } from "formik";

const AddPatientModal = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initialValues = {
    id_number: "",
    name: "",
    age: "",
    country: "",
    gender: "",
  };

  const validationSchema = Yup.object().shape({
    id_number: Yup.string()
      .test(
        "len",
        "The username must be between 3 and 8 characters.",
        (val) =>
          !val || (val.toString().length >= 3 && val.toString().length <= 20)
      )
      .required("This field is required!"),
    name: Yup.string().required("This field is required!"),
    age: Yup.string().required("This field is required!"),
    country: Yup.string().required("This field is required!"),
    gender: Yup.string().required("This field is required!"),
  });

  const handleCreatePatient = async (formValue, helpers) => {
    try {
      await CreateEmployee(formValue).then(() => {
        helpers.resetForm();
        toast.success("Employee created successfully");
      });
    } catch (err) {
      console.log("EMPLOYEE_ERROR ", err);
    }
  };

  return (
    <section>
      <button
        onClick={handleClickOpen}
        className="bg-[#02273D] text-white rounded px-2 py-2 text-sm shadow-2xl"
      >
        Add Patient
      </button>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Add Patient"}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleCreatePatient}
          >
            <Form>
              <section className="space-y-4">
                <div>
                  <Field
                    className="block border border-gray-400 rounded px-2 py-3 focus:outline-none w-full"
                    type="text"
                    placeholder="Id number"
                    name="id_number"
                  />
                  <ErrorMessage
                    name="id_number"
                    component="div"
                    className="text-red-600 text-xs"
                  />
                </div>
                <div>
                  <Field
                    className="block border border-gray-400 rounded px-2 py-3 focus:outline-none w-full"
                    type="text"
                    placeholder="Name"
                    name="name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-600 text-xs"
                  />
                </div>
                <div>
                  <Field
                    className="block border border-gray-400 rounded px-2 py-3 focus:outline-none w-full"
                    type="text"
                    placeholder="Age"
                    name="age"
                  />
                  <ErrorMessage
                    name="age"
                    component="div"
                    className="text-red-600 text-xs"
                  />
                </div>
                <div>
                  <Field
                    className="block border border-gray-400 rounded px-2 py-3 focus:outline-none w-full"
                    type="text"
                    placeholder="Country"
                    name="country"
                  />
                  <ErrorMessage
                    name="country"
                    component="div"
                    className="text-red-600 text-xs"
                  />
                </div>
                <div>
                  <Field
                    className="block border border-gray-400 rounded px-2 py-3 focus:outline-none w-full"
                    type="text"
                    placeholder="Gender"
                    name="gender"
                  />
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-red-600 text-xs"
                  />
                </div>
                <div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#02273D] px-4 py-3 w-full rounded text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </section>
            </Form>
          </Formik>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AddPatientModal;
