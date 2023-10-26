import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { assignDoctor } from "@/redux/service/patients";

export default function AssignDoctorModal({
  selectedRowData,
  assignOpen,
  setAssignOpen,
}) {
  console.log("SELECTED_ROW_DATA ", selectedRowData);

  const handleClickOpen = () => {
    setAssignOpen(true);
  };

  const handleClose = () => {
    setAssignOpen(false);
  };

  const initialValues = {
    appointment_date_time: selectedRowData?.appointment_date_time,
    status: selectedRowData?.status,
    reason: selectedRowData?.reason,
    fee: "",
    patient: selectedRowData?.id,
    assigned_doctor: 0,
    item_id: null,
    order_bill_ID: null,
  };

  const validationSchema = Yup.object().shape({
    assigned_doctor: Yup.number().required("Select a doctor!"),
  });

  const handleAssignDoctor = async (formValue, helpers) => {
    try {
      console.log("FORMDATA ",formValue);
      const formData = {
        ...formValue,
        assigned_doctor: parseInt(formValue.assigned_doctor)
      }
      await assignDoctor(formData).then(() => {
        helpers.resetForm();
        toast.success("Doctor Assigned Successfully!");
      });
    } catch (err) {
      toast.error(err);
      console.log("DOCTOR_ASSIGNED_ERROR ", err);
    }
  };

  return (
    <div>
      <button
        onClick={handleClickOpen}
        className="border border-card text-card font-semibold px-3 py-3 text-sm"
      >
        Assign Doctor
      </button>
      <Dialog
        open={assignOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <p>Are you sure you want to assign a doctor to selected patient?</p>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleAssignDoctor}
          >
            <Form>
              <Field
                as="select"
                className="block pr-9 mt-4 border border-gray py-3 px-4 focus:outline-none w-full"
                name="assigned_doctor"
              >
                <option value="">Select a Doctor</option>
                <option value="1">Dr. James Muriithi</option>
                <option value="2">Dr. Susan Akinyi</option>
                <option value="3">Dr. Mildred Kimani</option>
                <option value="4">Dr. Jane Gathuru</option>
              </Field>
              <ErrorMessage
                name="assigned_doctor"
                component="div"
                className="text-warning text-xs"
              />
              <Field
                className="block pr-9 mt-4 border border-gray py-3 px-4 focus:outline-none w-full"
                name="fee"
                placeholder="Enter Fee"
              />
              <ErrorMessage
                name="fee"
                component="div"
                className="text-warning text-xs"
              />
              <div className="flex items-center gap-2 justify-end mt-3">
                <button
                  type="submit"
                  className="bg-primary px-3 py-2 text-white"
                >
                  Proceed
                </button>
                <button
                  className="border border-warning px-3 py-2"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </Form>
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}
