import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Grid } from "@mui/material";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { getAllSearchedPatients } from "@/redux/features/patients";
import {
  getAllPatientBillingAppointments,
  getAllPatientBillingLabRequest,
  getAllPatientBillingPrescribedDrug,
} from "@/redux/features/billing";
import PatientCheckServices from "./checkServices";
import { billingInvoiceItems } from "@/redux/service/billing";
import { useAuth } from "@/assets/hooks/use-auth";

const AddInvoiceModal = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { searchedPatients } = useSelector((store) => store.patient);
  const {
    patientAppointment,
    patientLabRequest,
    patientPrescribedDrug,
    selectedAppointments,
    selectedLabRequests,
    selectedPrescribedDrugs,
  } = useSelector((store) => store.billing);
  const [inputValue, setInputValue] = useState("");
  const auth = useAuth();

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

      if (value.trim() === "" || value.length < 4) {
        // Clear the searchedPatients array or take appropriate action for short input
        // Example: dispatch(clearSearchedPatients());
      } else {
        await dispatch(getAllSearchedPatients(inputValue));
        await dispatch(
          getAllPatientBillingAppointments(searchedPatients[0]?.id)
        );
        await dispatch(getAllPatientBillingLabRequest(searchedPatients[0]?.id));
        await dispatch(
          getAllPatientBillingPrescribedDrug(searchedPatients[0]?.id)
        );
      }

      setLoading(false);
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };

  // const handleGenerateInvoice = () => {
  //   const appointmentPayload = {};
  //   selectedAppointments.forEach((appointment, index) => {
  //     appointmentPayload[`appointment_${index + 1}`] = {
  //       item_name: `item one`, // Adjust as per your naming convention
  //       item_price: "3000", // Add item price if available
  //       invoice_id: 1, // Replace with actual invoice ID
  //       service_id: 1, // Replace with actual service ID
  //     };
  //   });

  //   const labRequestPayload = {};
  //   selectedLabRequests.forEach((labRequest, index) => {
  //     labRequestPayload[`lab_request_${index + 1}`] = {
  //       item_name: "item one", // Adjust as per lab request payload structure
  //       item_price: "200", // Add item price if available
  //       invoice_id: 1, // Replace with actual invoice ID
  //       service_id: 1, // Replace with actual service ID
  //     };
  //   });

  //   const prescribedDrugsPayload = {};
  //   selectedPrescribedDrugs.forEach((prescribedDrug, index) => {
  //     prescribedDrugsPayload[`prescribed_drug_${index + 1}`] = {
  //       item_name: "item one", // Adjust as per prescribed drugs payload structure
  //       item_price: "300", // Add item price if available
  //       invoice_id: 1, // Replace with actual invoice ID
  //       service_id: 1, // Replace with actual service ID
  //     };
  //   });

  //   const combinedPayload = {
  //     appointment: appointmentPayload,
  //     lab: labRequestPayload,
  //     drugs: prescribedDrugsPayload,
  //   };

  //   console.log("Generated Combined Payload: ", combinedPayload);

  //   billingInvoiceItems(auth, combinedPayload);
  // };

  const handleGenerateInvoice = () => {
    const appointmentPayload = selectedAppointments.map((appointment, index) => ({
      item_name: `item one`, // Adjust as per your naming convention
      item_price: "3000", // Add item price if available
      invoice_id: 1, // Replace with actual invoice ID
      service_id: 1, // Replace with actual service ID
      ...appointment, // Add other appointment details as needed
    }));
  
    const labRequestPayload = selectedLabRequests.map((labRequest, index) => ({
      item_name: "item one", // Adjust as per lab request payload structure
      item_price: "200", // Add item price if available
      invoice_id: 1, // Replace with actual invoice ID
      service_id: 1, // Replace with actual service ID
      ...labRequest, // Add other lab request details as needed
    }));
  
    const prescribedDrugsPayload = selectedPrescribedDrugs.map((prescribedDrug, index) => ({
      item_name: "item one", // Adjust as per prescribed drugs payload structure
      item_price: "300", // Add item price if available
      invoice_id: 1, // Replace with actual invoice ID
      service_id: 1, // Replace with actual service ID
      ...prescribedDrug, // Add other prescribed drug details as needed
    }));
  
    const combinedPayload = {
      auth,
      appointment: appointmentPayload,
      lab: labRequestPayload,
      drugs: prescribedDrugsPayload,
    };
  
    console.log("Generated Combined Payload: ", combinedPayload);
  
    billingInvoiceItems(auth, combinedPayload);
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
                        placeholder="Search Patient"
                        // type="search"
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
                                onClick={() =>
                                  setInputValue(
                                    `${patient.first_name} ${patient.second_name}`
                                  )
                                }
                                className="text-xs px-4 cursor-pointer hover:bg-background rounded p-1 flex flex-col"
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
              <PatientCheckServices {...{ patientAppointment }} />
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
                onClick={handleGenerateInvoice}
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
