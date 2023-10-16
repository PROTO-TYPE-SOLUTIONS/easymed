import React,{useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { toast } from "react-toastify";

export default function CreateAppointmentModal({selectedRowData,open,setOpen}) {
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const createBookedAppointment = async() => {
    // make api call to create Booked Appointment
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <section className="space-y-6">
            <p className="text-center">Are you sure you want to create the selected Appointment?</p>
            <div className="flex items-center gap-2 justify-center mt-3">
              <button
                type="submit"
                onClick={createBookedAppointment}
                className="bg-success px-3 py-2 text-white"
              >
                Yes Proceed
              </button>
              <button
                className="border border-warning px-3 py-2"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </section>
        </DialogContent>
      </Dialog>
    </div>
  );
}
