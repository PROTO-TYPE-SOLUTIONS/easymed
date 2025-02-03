import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import * as Yup from "yup"
import DialogContent from "@mui/material/DialogContent";
import { Column, Pager } from "devextreme-react/data-grid";
import { Grid } from "@mui/material";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@/assets/hooks/use-auth";
import { ErrorMessage, Field, Form, Formik, validateYupSchema } from "formik";
import SeachableSelect from "@/components/select/Searchable";
import { payBillingInvoices } from "@/redux/service/billing";

const InvoicePayModal = ({selectedRowData, setOpen, open}) => {
    const [loading, setLoading] = useState(false);
    const [payMethod, setPayMethod] = useState("cash")
    const dispatch = useDispatch();
    const { patients } = useSelector((store) => store.patient);
    const auth = useAuth();


    console.log("SELECTED ROW DATA", selectedRowData)

    const selectedPatient = patients.find((patient)=> patient.id === selectedRowData.patient)

    const initialValues = {
      id:selectedRowData?.id,
      invoice_number:selectedRowData?.invoice_number,
      invoice_description: selectedRowData?.invoice_description,
      invoice_date: selectedRowData?.invoice_date,
      phone_number: selectedPatient?.phone_number,
      status: "paid"
    }

    const validationSchema = Yup.object().shape({
      phone_number: Yup.number().required("phone number is required !")
    });
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handlePay = async (formValue) => {
      const payload = {
        ...formValue,
      }

  
      try {

        console.log("MPESA PAYMENT PAYLOAD", payload)
        await payBillingInvoices(auth, payload);
        toast.success("payment successfull");

      } catch (err) {
        toast.error(err);
        setLoading(false);
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
        <Grid container className="my-4 bg-background rounded-lg py-4 items-center flex" spacing={2}>

          <Grid item md={4} xs={12}>
            <h3 className="font-semibold text-xl text-primary">{`${selectedPatient?.first_name} ${selectedPatient?.second_name}`}</h3>
          </Grid>
          <Grid item md={4} xs={12}>
            <h3 className="font-semibold py-1">{`Invoice: ${selectedRowData?.invoice_number}`}</h3>
            <h3 className="py-1">{`${selectedRowData?.invoice_description}`}</h3>
          </Grid>
          <Grid item md={4} xs={12}>
            <h3 className="font-semibold py-1">{`${selectedRowData?.invoice_amount}`}</h3>
            <h3 className={`py-1 ${selectedRowData.status === "pending" ? "text-warning" : "text-primary"}`}>{`${selectedRowData?.status}`}</h3>
          </Grid>

        </Grid>

        <Grid container className="my-2" spacing={2}>

          <Grid onClick={()=>setPayMethod("cash")} item md={4} xs={12}>
            <div className={`p-2 ${payMethod === "cash" ? "bg-card text-white" : "bg-background"} border border-gray rounded-lg text-center cursor-pointer`}>Cash</div>
          </Grid>

          <Grid onClick={()=>setPayMethod("mpesa")} item md={4} xs={12}>
            <div className={`p-2 ${payMethod === "mpesa" ? "bg-success text-white" : "bg-background"} border border-gray rounded-lg text-center cursor-pointer`}>Mpesa</div>
          </Grid>
          
          <Grid onClick={()=>setPayMethod("insurance")} item md={4} xs={12}>
            <div className={`p-2 ${payMethod === "insurance" ? "bg-orange text-white" : "bg-background"} border border-gray rounded-lg text-center cursor-pointer`}>Insurance</div>
          </Grid>

        </Grid>
        
        {payMethod && (payMethod === "cash") && (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handlePay}
          >
            <Form className="py-4">
              <label className="py-2 text-lg">Enter amount</label>
              <Field
                className="border border-gray w-full p-4 focus:outline-none rounded-lg my-2"
                  name="amount"
                  placeholder="Enter amount"
                  type="number"
              />
              <ErrorMessage
                name="amount"
                component="div"
                className="text-warning text-xs"
              />
            </Form>
          </Formik>
        )}

        {payMethod && (payMethod === "mpesa") && (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handlePay}
          >
            <Form className="py-4">
              <label className="py-2 text-lg">Confirm Your Phone Number ?</label>
              <Field
                className="border border-gray w-full p-4 focus:outline-none rounded-lg my-2"
                  name="phone_number"
                  placeholder="phone_number"
                  type="number"
              />
              <ErrorMessage
                name="phone_number"
                component="div"
                className="text-warning text-xs"
              />

              <div>
                <div className="flex justify-end gap-4 mt-8">
                <button
                    onClick={handleClose}
                    className="border border-warning rounded-xl text-sm px-4 py-2 text-[#02273D]"
                  >
                    Cancel
                  </button>
                  
                </div>
              </div>  
  
            </Form>
          </Formik>
        )}


        {payMethod != "mpesa" && (
          <div>
            <div className="flex justify-end gap-4 mt-8">
            <button
                onClick={handleClose}
                className="border border-warning rounded-xl text-sm px-4 py-2 text-[#02273D]"
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                className="bg-primary rounded-xl text-sm px-4 py-2 text-white"
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
                {`Pay with ${payMethod}`}
              </button>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  </section>
  )
}

export default InvoicePayModal