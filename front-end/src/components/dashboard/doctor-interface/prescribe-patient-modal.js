import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Divider } from "@mui/material";
import { Grid } from "@mui/material";

const PrescribePatientModal = ({ selectedRowData, prescribeOpen, setPrescribeOpen }) => {
  const [loading, setLoading] = React.useState(false);


  const handleClose = () => {
    setPrescribeOpen(false);
  };

  const initialValues = {
    prescription: "",
  };

  const validationSchema = Yup.object().shape({
    prescription: Yup.string().required("This field is required!"),
  });

  const handlePrescribePatient = async (formValue, helpers) => {
    console.log("PRESCRIBE_PAYLOAD ", formValue);
    try {
      setLoading(true);
      // await createPatient(formValue).then(() => {
      //   helpers.resetForm();
      //   toast.success("Patient Referred Successfully!");
      //   setLoading(false);
      // });
    } catch (err) {
      toast.error(err);
      console.log("PRESCRIBE_ERROR ", err);
    }
  };

  return (
    <section>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={prescribeOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handlePrescribePatient}
          >
            <Form>
              <section className="space-y-2">
                <h1 className="text-xl text-center">Add Prescription</h1>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                    <Field
                      as="textarea"
                      className="block border border-gray py-3 px-4 focus:outline-none w-full"
                      type="text"
                      placeholder="Add Patient Prescription"
                      name="prescription"
                    />
                    <ErrorMessage
                      name="prescription"
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
                      Forward to Lab
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

export default PrescribePatientModal;
