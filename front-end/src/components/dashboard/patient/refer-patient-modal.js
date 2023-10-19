import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Divider } from "@mui/material";
import { TextField, Autocomplete, Grid } from "@mui/material";
import { getAutoCompleteValue } from "@/assets/file-helper";

const ReferPatientModal = ({ selectedRowData, open, setOpen }) => {
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
    patientId: null,
    medicationId: null,
    facility_name: "",
    section: "",
    residence: "",
    notes: "",
  };

  const validationSchema = Yup.object().shape({
    patientId: Yup.string().required("This field is required!"),
    medicationId: Yup.string().required("This field is required!"),
    facility_name: Yup.string().required("This field is required!"),
    section: Yup.string().required("This field is required!"),
    residence: Yup.string().required("This field is required!"),
    notes: Yup.string().required("This field is required!"),
  });

  const handleReferPatient = async (formValue, helpers) => {
    console.log("REFER_PAYLOAD ", formValue);
    try {
      const formData = {
        ...formValue,
        patientId: parseInt(formValue.patientId),
        medicationId: parseInt(formValue.medicationId),
      };
      setLoading(true);
      // await createPatient(formData).then(() => {
      //   helpers.resetForm();
      //   toast.success("Patient Referred Successfully!");
      //   setLoading(false);
      // });
    } catch (err) {
      toast.error(err);
      console.log("PATIENT_ERROR ", err);
    }
  };

  return (
    <section>
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
            onSubmit={handleReferPatient}
          >
            <Form>
              <section className="space-y-2">
                <p>Patient</p>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12}>
                    <Field
                      as="select"
                      className="block pr-9 border border-gray py-3 px-4 focus:outline-none w-full"
                      name="patientId"
                    >
                      <option value="">Select Patient</option>
                      <option value="M">Marcos</option>
                      <option value="F">Faith</option>
                    </Field>
                    <ErrorMessage
                      name="patientId"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Field
                      as="select"
                      className="block pr-9 border border-gray py-3 px-4 focus:outline-none w-full"
                      name="medicationId"
                    >
                      <option value="">Select Medication</option>
                      <option value="M">Malaria Tabs</option>
                      <option value="F">Typhoid Tabs</option>
                    </Field>
                    <ErrorMessage
                      name="medicationId"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12}>
                    <Field
                      className="block border border-gray py-3 px-4 focus:outline-none w-full"
                      type="text"
                      placeholder="Facility Name"
                      name="facility_name"
                    />
                    <ErrorMessage
                      name="facility_name"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Field
                      className="block border border-gray py-3 px-4 focus:outline-none w-full"
                      type="text"
                      placeholder="Section"
                      name="section"
                    />
                    <ErrorMessage
                      name="section"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Field
                      className="block border border-gray py-3 px-4 focus:outline-none w-full"
                      type="text"
                      placeholder="Residence"
                      name="residence"
                    />
                    <ErrorMessage
                      name="residence"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                    <Field
                      as="textarea"
                      className="block border border-gray py-3 px-4 focus:outline-none w-full"
                      type="text"
                      placeholder="Notes"
                      name="notes"
                    />
                    <ErrorMessage
                      name="notes"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </Grid>
                </Grid>
                <div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="submit"
                      className="bg-[#02273D] px-4 py-2 text-white"
                    >
                      Refer Patient
                    </button>
                    <button
                      type="submit"
                      onClick={handleClose}
                      className="border border-warning px-4 py-2"
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

export default ReferPatientModal;
