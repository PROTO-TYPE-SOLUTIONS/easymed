import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Grid } from "@mui/material";
import { consultPatient } from "@/redux/service/patients";
import { useContext } from "react";
import { authContext } from "@/components/use-context";

const ConsultPatientModal = ({
  selectedRowData,
  consultOpen,
  setConsultOpen,
}) => {
  const [loading, setLoading] = React.useState(false);
  const { user } = useContext(authContext);

  const handleClose = () => {
    setConsultOpen(false);
  };

  const initialValues = {
    note: "",
    complaint: "",
    disposition: "admitted",
    doctor_ID: user?.user_id,
    patient_id: selectedRowData?.id,
  };

  const validationSchema = Yup.object().shape({
    notes: Yup.string().required("This field is required!"),
  });

  const handleConsultPatient = async (formValue, helpers) => {
    console.log("CONSULT_PAYLOAD ", formValue);
    try {
      const formData = {
        ...formValue,
        patient_id: parseInt(formValue.patient_id),
        doctor_ID: parseInt(formValue.doctor_ID),
      };
      setLoading(true);
      await consultPatient(formData).then(() => {
        helpers.resetForm();
        toast.success("Consultation Successful!");
        setLoading(false);
      });
    } catch (err) {
      toast.error(err);
      console.log("CONSULT_ERROR ", err);
    }
  };

  return (
    <section>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={consultOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleConsultPatient}
          >
            <Form>
              <section className="space-y-2">
                <h1 className="text-xl text-center">Add Consultation Notes</h1>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                    <section className="space-y-3">
                      <div>
                        <Field
                          as="textarea"
                          className="block border border-gray py-3 px-4 focus:outline-none w-full"
                          type="text"
                          placeholder="Add Consultation Notes"
                          name="notes"
                        />
                        <ErrorMessage
                          name="notes"
                          component="div"
                          className="text-warning text-xs"
                        />
                      </div>
                      <div>
                        <Field
                          as="textarea"
                          className="block border border-gray py-3 px-4 focus:outline-none w-full"
                          type="text"
                          placeholder="Add Complaint"
                          name="complaint"
                        />
                      </div>
                    </section>
                  </Grid>
                </Grid>
                <div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="submit"
                      className="bg-[#02273D] px-4 py-2 text-white text-sm"
                    >
                      Submit
                    </button>
                    <button
                      type="submit"
                      onClick={handleClose}
                      className="border border-warning px-4 py-2 text-sm"
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

export default ConsultPatientModal;
