import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import * as Yup from "yup"
import DialogContent from "@mui/material/DialogContent";
import { Column, Pager } from "devextreme-react/data-grid";
import { DialogTitle, Grid } from "@mui/material";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@/assets/hooks/use-auth";
import { ErrorMessage, Field, Form, Formik, validateYupSchema } from "formik";
import SeachableSelect from "@/components/select/Searchable";
import { payBillingInvoices } from "@/redux/service/billing";

const InvoicePayModal = ({selectedPayMethod, selectedRowData, setOpen, open}) => {
    const [loading, setLoading] = useState(false);
    const [payMethod, setPayMethod] = useState("cash")
    const dispatch = useDispatch();
    const { patients } = useSelector((store) => store.patient);
    const auth = useAuth();


    console.log("SELECTED ROW DATA", selectedRowData)

    const selectedPatient = patients.find((patient)=> patient.id === selectedRowData.patient)
    const handleClose = () => {
      setOpen(false);
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
      <DialogTitle className="w-full bg-gray font-bold items-center justify-center flex">{`Todays ${selectedPayMethod} total amount`}</DialogTitle>
      <DialogContent>
        <div className="items-center justify-center flex ">
          <h2 className="font-bold text-2xl">{`${selectedPayMethod}: ${selectedRowData ? selectedRowData?.total_amount : 0}`}</h2>
        </div>
      </DialogContent>
    </Dialog>
  </section>
  )
}

export default InvoicePayModal