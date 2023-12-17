import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Grid } from "@mui/material";
import * as Yup from "yup";
import { addInventory } from "@/redux/service/inventory";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { getAllSearchedPatients } from "@/redux/features/patients";
import { getAllPatientBillingAppointments, getAllPatientBillingLabRequest, getAllPatientBillingPrescribedDrug } from "@/redux/features/billing";
import { useAuth } from "@/assets/hooks/use-auth";
import PatientCheckServices from "./checkServices";

const AddInvoiceModal = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { searchedPatients } = useSelector((store) => store.patient);
  const { patientAppointment,patientLabRequest,patientPrescribedDrug } = useSelector((store) => store.billing);
  const [inputValue, setInputValue] = useState("");
  const auth = useAuth();

  console.log("PATIENT_APPOINTMENT ",patientAppointment)
  console.log("LAB_REQUEST ",patientLabRequest)
  console.log("PRESCRIBED_DRUG ",patientPrescribedDrug)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initialValues = {
    first_name: "",
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("This field is required!"),
  });

  const handleInputChange = async (event) => {
    const { value } = event.target;
    setInputValue(value);

    try {
      setLoading(true);

      if (value.trim() === "" || value.length < 3) {
        // Clear the searchedPatients array or take appropriate action for short input
        // Example: dispatch(clearSearchedPatients());
      } else {
        await dispatch(getAllSearchedPatients(inputValue));
        await dispatch(getAllPatientBillingAppointments(searchedPatients[0]?.id));
        await dispatch(getAllPatientBillingLabRequest(auth,searchedPatients[0]?.id));
        await dispatch(getAllPatientBillingPrescribedDrug(auth,searchedPatients[0]?.id));
      }

      setLoading(false);
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };

  
  return (
    <section>
      <button
        onClick={handleClickOpen}
        className="bg-primary text-white text-sm rounded px-3 py-2 mb-1"
      >
        Add Invoice
      </button>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          {currentStep === 0 && (
            <>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                <Form className="">
                  <Grid container spacing={2}>
                    <Grid item md={12} xs={12}>
                      <input
                        className="block border rounded-xl text-sm border-gray py-2 px-4 focus:outline-card w-full"
                        maxWidth="sm"
                        placeholder="Search Patient"
                        name="first_name"
                        onChange={handleInputChange}
                        value={inputValue}
                      />
                      <ErrorMessage
                        name="first_name"
                        component="div"
                        className="text-warning text-xs"
                      />
                      <div>
                        {inputValue !== "" &&
                          searchedPatients
                            .filter((patient) =>
                              `${patient.first_name} ${patient.second_name}`
                                .toLowerCase()
                                .includes(inputValue.toLowerCase())
                            )
                            .map((patient, index) => (
                              <span
                              onClick={() => setInputValue(`${patient.first_name} ${patient.second_name}`)}
                               className="text-sm px-4 cursor-pointer hover:bg-background rounded p-1"
                                key={index}
                              >{`${patient.first_name} ${patient.second_name}`}</span>
                            ))}
                      </div>
                    </Grid>
                  </Grid>
                </Form>
              </Formik>
            </>
          )}
          {currentStep === 1 && (
            <section className="">
              <PatientCheckServices {...{patientAppointment}} />
            </section>
          )}
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="border border-primary rounded-xl px-4 py-2 text-sm"
            >
              Prev
            </button>
            {currentStep === 0 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-primary text-white rounded-xl px-4 py-2 text-sm"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-primary text-white rounded-xl px-4 py-2 text-sm"
              >
                Generate Invoice
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AddInvoiceModal;
