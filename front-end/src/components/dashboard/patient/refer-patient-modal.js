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
import { getAllServices } from "@/redux/features/patients";
import { useSelector, useDispatch } from "react-redux";

const ReferPatientModal = ({ selectedRowData, open, setOpen }) => {
  const [loading, setLoading] = React.useState(false);
  const { user } = useContext(authContext);

  console.log("USER_ID ",user)

  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const services = [
      'general',
      'dentist',
      'cardiologist',
      'neurologist',
      'orthopedist',
      'psychiatrist',
      'surgeon',
      'physiotherapist',
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
    console.log("REFER_PAYLOAD ", formValue);
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
      });
    } catch (err) {
      toast.error(err);
      console.log("REFER_ERROR ", err);
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
                <h1 className="text-xl text-center">Refer Patient</h1>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12}>
                    <Field
                      as="textarea"
                      className="block pr-9 border border-gray py-3 px-4 focus:outline-none w-full"
                      name="note"
                      placeholder="note"
                    />

                    <ErrorMessage
                      name="note"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Field
                      as="select"
                      className="block pr-9 border border-gray py-3 px-4 focus:outline-none w-full"
                      name="service"
                    >
                      <option value="">Select service</option>
                      {services.map((service,index) => (
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
                  <Grid item md={4} xs={12}>
                    <Field
                      className="block border border-gray py-3 px-4 focus:outline-none w-full"
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
