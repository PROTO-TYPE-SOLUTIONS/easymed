import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast } from 'react-toastify'


export default function AssignDoctorModal({ selectedRecords }) {
  const [open, setOpen] = React.useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initialValues = {
    doctorId: null,
    patients: [
      {
        age: "",
        country: "",
        gender: "",
        id_number: "",
        name: "",
      },
    ],
  };

  const validationSchema = Yup.object().shape({
    doctorId: Yup.number().required("Select a doctor!"),
  });

  const handleAssignDoctor = async (formValue, helpers) => {
    try {
        if(Array.isArray(selectedRecords) && selectedRecords.length > 0) {
            const patientsData = selectedRecords.map((record) => ({
                age: record.age || "",
                country: record.country || "",
                gender: record.gender || "",
                id_number: record.id_number || "",
                name: record.name || "",
              }));
              const formData = {
                ...formValue,
                doctorId: parseInt(formValue.doctorId),
                patients: patientsData
              }
              console.log("PAYLOAD ",formData);
              //   await bookAppointment(formData).then(() => {
              //     helpers.resetForm();
              //     toast.success("Appointment Booked Successfully!");
              //     router.push("/");
              //   });
        }
    } catch (err) {
      toast.error(err);
      console.log("APPOINTMENT_ERROR ", err);
    }
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
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleAssignDoctor}
          >
            <Form>
              <Field
                as="select"
                className="block pr-9 mt-4 border border-primary rounded py-3 px-4 focus:outline-none w-full"
                name="doctorId"
              >
                <option value="">Select a Doctor</option>
                <option value="1">Dr. James Muriithi</option>
                <option value="2">Dr. Susan Akinyi</option>
                <option value="3">Dr. Mildred Kimani</option>
                <option value="4">Dr. Jane Gathuru</option>
              </Field>
              <ErrorMessage
                name="doctorId"
                component="div"
                className="text-warning text-xs"
              />
              <div className="flex items-center gap-2 justify-end mt-3">
                <button
                  type="submit"
                  className="bg-success rounded px-3 py-2 text-white"
                >
                  Proceed
                </button>
                <button
                  className="border border-warning rounded px-3 py-2"
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
