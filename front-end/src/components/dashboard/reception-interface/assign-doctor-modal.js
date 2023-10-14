import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AssignDoctorModal({ selectedRecords }) {
  const [open, setOpen] = React.useState(false);

  console.log("MODAL_RECORDS ", selectedRecords);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleClickOpen}
        className="border border-primary px-3 py-2 rounded"
      >
        Assign Doctor
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <p>Are you sure you want to assign a doctor to selected patients?</p>
          <form>
            <div className="flex items-center justify-center mt-6">
              <input className="border border-primary rounded py-2 px-3 focus:outline-none" />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <button className="bg-success rounded px-3 py-2 text-white">
            Proceed
          </button>
          <button
            className="border border-warning rounded px-3 py-2"
            onClick={handleClose}
            autoFocus
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
