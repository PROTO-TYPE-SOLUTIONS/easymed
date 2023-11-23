import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { useAuth } from "@/assets/hooks/use-auth";
import { createTriage } from "@/redux/service/nursing";



export default function AddTriageModal({
  triageOpen,
  setTriageOpen,
  selectedRowData,
}) {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const handleClose = () => {
    setTriageOpen(false);
  };

  const initialValues = {
    temperature: "",
    height: "",
    weight: null,
    pulse: null,
  };

  const validationSchema = Yup.object().shape({
    temperature: Yup.number().required("Temperature is required!"),
    height: Yup.number().required("Height is required!"),
    weight: Yup.number().required("Weight is required!"),
    pulse: Yup.number().required("Pulse is required!"),
  });

  const handleAddTriage = async (formValue, helpers) => {
    try {
      const formData = {
        ...formValue,
        created_by: auth?.user_id,
        patient_id: selectedRowData?.id,
      };
      setLoading(true);
      await createTriage(formData,auth).then(() => {
        helpers.resetForm();
        setLoading(false);
        handleClose(); 
        toast.success("Triage Created Successfully!");
      });
    } catch (err) {
      setLoading(false);
      toast.error(err);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={triageOpen}
        fullWidth
        maxWidth="sm"
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Add Triage"}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleAddTriage}
          >
            <Form className="w-full">
              <section className="flex items-center justify-between gap-4">
                <section className="space-y-2 w-full">
                  <div className="w-full">
                    <Field
                      className="block border text-sm border-gray py-3 px-4 focus:outline-none w-full"
                      type="text"
                      placeholder="Temperature"
                      name="temperature"
                    />
                    <ErrorMessage
                      name="temperature"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </div>
                  <div className="w-full">
                    <Field
                      className="block border text-sm border-gray py-3 px-4 focus:outline-none w-full"
                      type="text"
                      placeholder="Height"
                      name="height"
                    />
                    <ErrorMessage
                      name="height"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </div>
                </section>
                <section className="space-y-2 w-full">
                  <div className="w-full">
                    <Field
                      className="block border text-sm border-gray py-3 px-4 focus:outline-none w-full"
                      type="text"
                      placeholder="Weight"
                      name="weight"
                    />
                    <ErrorMessage
                      name="weight"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </div>
                  <div className="w-full">
                    <Field
                      className="block border text-sm border-gray py-3 px-4 focus:outline-none w-full"
                      type="text"
                      placeholder="Pulse"
                      name="pulse"
                    />
                    <ErrorMessage
                      name="pulse"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </div>
                </section>
              </section>
              <button
                type="submit"
                className="bg-primary text-sm w-full px-8 py-3 mt-3 text-white"
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
                Create Triage
              </button>
            </Form>
          </Formik>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
