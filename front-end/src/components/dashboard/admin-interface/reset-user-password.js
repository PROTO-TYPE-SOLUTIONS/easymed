import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify"
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { DialogTitle, Divider } from "@mui/material";
import { Grid } from "@mui/material";
import { useAuth } from "@/assets/hooks/use-auth";
import { getAllTheUsers } from "@/redux/features/users";
import Reset from "@/pages/auth/forgot-password";


const ResetUserPassword = ({ open, setOpen, selectedRowData }) => {
    console.log("ROW_DATA ", selectedRowData);
    console.log("ResetUserPassword modal state: ", open);
    const [loading, setLoading] = useState(false);
    const auth = useAuth();
    const dispatch = useDispatch();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <section>
            <Dialog
                fullWidth
                maxWidth="md"
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>
                    <h1 className="text-2xl text-primary font-bold">Reset User Password</h1>
                </DialogTitle>
                <DialogContent>
                    <Reset />
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default ResetUserPassword;
