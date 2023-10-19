import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Grid } from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import { createPatient } from "@/redux/service/patients";
import { toast } from "react-toastify";

const AddPatientModal = () => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const gender = [
    {
      id: 1,
      name: "Male",
    },
    {
      id: 2,
      name: "Female",
    },
  ];

  const initialValues = {
    first_name: "",
    second_name: "",
    date_of_birth: "",
    gender: "",
    insurance: null,
    user_id: null,
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First Name is required!"),
    second_name: Yup.string().required("Second Name is required!"),
    date_of_birth: Yup.string().required("Date is required!"),
    gender: Yup.string().required("Select gender!"),
    insurance: Yup.number().required("Provide a insurance details!"),
    user_id: Yup.number().required("Provide a user id!"),
  });


  const handleCreatePatient = async (formValue, helpers) => {
    console.log("PATIENT_PAYLOAD ", formValue);
    try {
      const formData = {
        ...formValue,
        insurance: parseInt(formValue.insurance),
        user_id: parseInt(formValue.user_id),
      }
      setLoading(true);
      await createPatient(formData).then(() => {
        helpers.resetForm();
        toast.success("Patient Created Successfully!");
        setLoading(false);
      });
    } catch (err) {
      toast.error(err);
      console.log("PATIENT_ERROR ", err);
    }
  };

  return (
    <section>
      <button
        onClick={handleClickOpen}
        className="bg-primary text-white px-4 py-3 text-sm flex items-center gap-1"
      >
        <IoMdAdd /> Create Patient
      </button>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleCreatePatient}
          >
            <Form>
              <section className="space-y-2">
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12}>
                    <Field
                      className="block border border-gray py-3 px-4 focus:outline-none w-full"
                      type="text"
                      placeholder="First Name"
                      name="first_name"
                    />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Field
                      className="block border border-gray py-3 px-4 focus:outline-none w-full"
                      type="text"
                      placeholder="Second Name"
                      name="second_name"
                    />
                    <ErrorMessage
                      name="second_name"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12}>
                    <Field
                      className="block border border-gray py-3 px-4 focus:outline-none w-full"
                      type="date"
                      placeholder="Date of Birth"
                      name="date_of_birth"
                    />
                    <ErrorMessage
                      name="date_of_birth"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Field
                      as="select"
                      className="block pr-9 border border-gray py-3 px-4 focus:outline-none w-full"
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
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12}>
                    <Field
                      className="block border border-gray py-3 px-4 focus:outline-none w-full"
                      type="text"
                      placeholder="Insurance"
                      name="insurance"
                    />
                    <ErrorMessage
                      name="insurance"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Field
                      className="block border border-gray py-3 px-4 focus:outline-none w-full"
                      type="text"
                      placeholder="User"
                      name="user_id"
                    />
                    <ErrorMessage
                      name="user_id"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </Grid>
                </Grid>

                <div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="submit"
                      className="bg-primary px-4 py-2 text-white"
                    >
                      Save Patient
                    </button>
                    <button
                      onClick={handleClose}
                      className="border border-warning px-4 py-2 text-[#02273D]"
                    >
                      Cancel
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
