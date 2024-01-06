import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { assignDoctor } from "@/redux/service/patients";
import { getAllDoctors } from "@/redux/features/doctors";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@/assets/hooks/use-auth";
import {
  getAllAppointments,
  getAllPatientAppointments,
} from "@/redux/features/appointment";

export default function AssignDoctorModal({
  selectedRowData,
  assignOpen,
  setAssignOpen,
}) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { doctors } = useSelector((store) => store.doctor);
  const authUser = useAuth();
  console.log("SELECTED_ROW ", selectedRowData);

  const handleClickOpen = () => {
    setAssignOpen(true);
  };

  const handleClose = () => {
    setAssignOpen(false);
  };

  useEffect(() => {
    if (authUser) {
      dispatch(getAllDoctors(authUser));
    }
  }, [authUser]);

  const status = ["pending", "confirmed", "cancelled"];

  const initialValues = {
    patient: null,
    appointment_date_time: "",
    status: "",
    reason: "",
    fee: "",
    assigned_doctor: null,
    item_id: null,
  };

  const validationSchema = Yup.object().shape({
    assigned_doctor: Yup.number().required("Select a doctor!"),
    status: "",
  });

  const handleAssignDoctor = async (formValue, helpers) => {
    try {
      console.log("FORMDATA ", formValue);
      

      setLoading(true);
      const formData = {
        ...formValue,
        patient: selectedRowData.id,
        assigned_doctor: parseInt(formValue.assigned_doctor),
      };
      await assignDoctor(formData).then(() => {
        helpers.resetForm();
        toast.success("Doctor Assigned Successfully!");
        setLoading(false);
        dispatch(getAllPatientAppointments());
        handleClose();
      });
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };

  return (
    <div>
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
                className="block pr-9 mt-4 border border-gray rounded-xl py-2 text-sm px-4 focus:outline-none w-full"
                name="assigned_doctor"
              >
                <option value="">Select a Doctor</option>
                {doctors.map((doctor, index) => (
                  <option
                    key={index}
                    value={doctor?.id}
                  >{`${doctor?.first_name} ${doctor.last_name}`}</option>
                ))}
              </Field>
              <ErrorMessage
                name="assigned_doctor"
                component="div"
                className="text-warning text-xs"
              />
              <Field
                as="select"
                className="block pr-9 mt-4 border border-gray rounded-xl py-2 text-sm px-4 focus:outline-none w-full"
                name="status"
              >
                <option value="">Select Status</option>
                {status.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="status"
                component="div"
                className="text-warning text-xs"
              />
              <Field
                className="block pr-9 mt-4 border border-gray rounded-xl py-2 text-sm px-4 focus:outline-none w-full"
                name="fee"
                placeholder="Enter Fee"
              />
              <ErrorMessage
                name="fee"
                component="div"
                className="text-warning text-xs"
              />
              <Field
                className="block pr-9 mt-4 border border-gray rounded-xl py-2 text-sm px-4 focus:outline-none w-full"
                name="appointment_date_time"
                placeholder="Appointment date time"
                type="date"
              />
              <ErrorMessage
                name="appointment_date_time"
                component="div"
                className="text-warning text-xs"
              />
              <Field
                className="block pr-9 mt-4 border border-gray rounded-xl py-2 text-sm px-4 focus:outline-none w-full"
                name="reason"
                placeholder="Reason"
              />
              <ErrorMessage
                name="reason"
                component="div"
                className="text-warning text-xs"
              />
              <div className="flex items-center gap-2 justify-end mt-3">
                <button
                  type="submit"
                  className="bg-primary px-3 py-2 text-sm text-white rounded-xl"
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
                  Proceed
                </button>
                <p
                  className="border border-warning text-sm rounded-xl px-3 py-2 cursor-pointer"
                  onClick={handleClose}
                >
                  Cancel
                </p>
              </div>
            </Form>
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}
