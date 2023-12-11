import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Grid } from "@mui/material";
import * as Yup from "yup";
import { addInventory } from "@/redux/service/inventory";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

const AddInvoiceModal = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initialValues = {
    quantity: "",
  };

  const validationSchema = Yup.object().shape({
    quantity: Yup.string().required("This field is required!"),
  });

  const handleSearchPatient = async (formValue, helpers) => {
    try {
      setLoading(true);
      await addInventory(formValue).then(() => {
        helpers.resetForm();
        toast.success("Inventory Added Successfully!");
        setLoading(false);
      });
    } catch (err) {
      toast.error(err);
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
        maxWidth="sm"
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
                onSubmit={handleSearchPatient}
              >
                <Form className="">
                  <Grid container spacing={2}>
                    <Grid item md={12} xs={12}>
                      <Field
                        className="block border rounded-xl text-sm border-gray py-2 px-4 focus:outline-card w-full"
                        maxWidth="sm"
                        placeholder="Search Patient"
                        name="quantity"
                      />
                      <ErrorMessage
                        name="quantity"
                        component="div"
                        className="text-warning text-xs"
                      />
                    </Grid>
                  </Grid>
                </Form>
              </Formik>
            </>
          )}
          {currentStep === 1 && (
            <section className="border border-gray h-[40vh] flex items-center justify-center rounded p-4">
              Display Patient Details Here
            </section>
          )}
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={handleClose}
              className="border border-primary rounded-xl px-4 py-2 text-sm"
            >
              Cancel
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
