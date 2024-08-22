import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Grid } from "@mui/material";
import { referPatient } from "@/redux/service/patients";
import { toast } from "react-toastify";
import { useContext } from "react";
import { authContext } from "@/components/use-context";
import { useDispatch, useSelector } from "react-redux";
import { getPatientTriage } from "@/redux/features/patients";

const ReferPatientModal = ({ selectedRowData, open, setOpen }) => {
  const [loading, setLoading] = React.useState(false);
  const { patientTriage } = useSelector((store) => store.patient);
  const { user } = useContext(authContext);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const services = [
    "general",
    "dentist",
    "cardiologist",
    "neurologist",
    "orthopedist",
    "psychiatrist",
    "surgeon",
    "physiotherapist",
  ];

  const initialValues = {
    note: "",
    service: "",
    email: "",
    patient_id: selectedRowData?.id,
    referred_by: user?.user_id,
  };

  const validationSchema = Yup.object().shape({
    note: Yup.string().required("This field is required!"),
    service: Yup.string().required("This field is required!"),
    email: Yup.string()
      .email("This is not a valid email")
      .required("Email is required!"),
  });

  const handleReferPatient = async (formValue, helpers) => {
    try {
      const formData = {
        ...formValue,
        patient_id: parseInt(formValue.patient_id),
        referred_by: parseInt(formValue.referred_by),
      };
      setLoading(true);
      await referPatient(formData).then(() => {
        helpers.resetForm();
        toast.success("Patient Referred Successfully!");
        setLoading(false);
        handleClose();
      });
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getPatientTriage(selectedRowData?.triage));
  }, [selectedRowData]);

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
                <h1 className="">Triage Information</h1>
                <section className="flex items-center justify-between text-sm border-b bg-background p-1 rounded border-gray">
                  <div className="flex items-center gap-2">
                    <span>Temperature :</span>
                    <span>{patientTriage?.temperature}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Height :</span>
                    <span>{patientTriage?.height}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Pulse :</span>
                    <span>{patientTriage?.pulse}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Weight :</span>
                    <span>{patientTriage?.weight}</span>
                  </div>
                </section>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12}>
                    <Field
                      className="block border border-gray rounded-xl text-sm py-2 px-4 focus:outline-none w-full"
                      type="text"
                      placeholder="email"
                      name="email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Field
                      as="select"
                      className="block pr-9 border border-gray rounded-xl py-2 text-sm px-4 focus:outline-none w-full"
                      name="service"
                    >
                      <option value="">Select service</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>
                          {service}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="service"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                    <Field
                      as="textarea"
                      className="block pr-9 border rounded-xl border-gray py-2 text-sm px-4 focus:outline-none w-full"
                      name="note"
                      placeholder="note"
                    />

                    <ErrorMessage
                      name="note"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </Grid>
                </Grid>
                <div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="submit"
                      className="bg-[#02273D] px-4 rounded-xl text-sm py-2 text-white"
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
                      Refer Patient
                    </button>
                    <button
                      type="submit"
                      onClick={handleClose}
                      className="border border-warning rounded-xl text-sm px-4 py-2"
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
