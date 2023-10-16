import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Divider } from "@mui/material";
import { TextField, Autocomplete, Grid } from "@mui/material";
import { getAutoCompleteValue } from "@/assets/file-helper";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { BiEdit } from "react-icons/bi";

const DeletePatientModal = ({ deleteOpen, setDeleteOpen, selectedRowData }) => {

  const handleClickOpen = () => {
    setDeleteOpen;(true);
  };

  const handleClose = () => {
    setDeleteOpen(false);
  };

  return (
    <section>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={deleteOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <h1 className="text-center">Are you sure you want to delete the selected Patient?</h1>
          <div className="flex items-center gap-4 justify-center mt-4">
            <button type="submit" className="bg-success px-4 py-2 text-white">
              Yes Proceed
            </button>
            <button
              type="submit"
              onClick={handleClose}
              className="border border-warning px-4 py-2 text-[#02273D]"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default DeletePatientModal;
