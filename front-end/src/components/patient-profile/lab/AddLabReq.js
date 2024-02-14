import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Container, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import SeachableSelect from '@/components/select/Searchable';
import { getAllServices } from "@/redux/features/patients";
import { getAllLabTestProfiles } from "@/redux/features/laboratory";
import { IoAddOutline } from "react-icons/io5";
import { patientLabtestRequest } from '@/redux/service/patientUser';
import { useAuth } from '@/assets/hooks/use-auth';

const AddPatientLabReq = () => {
    const { services } = useSelector(({ patient }) => patient);
    const { labTestProfiles } = useSelector((store) => store.laboratory);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const auth = useAuth()
    const { patients } = useSelector((store) => store.patient);
    const loggedInPatient = patients.find((patient)=> patient.user === auth?.user_id)

    console.log("ADD PATIENT LAB TEST REQUEST", loggedInPatient)

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };
  
    const initialValues = {
      first_name: loggedInPatient?.first_name,
      last_name: loggedInPatient?.second_name,
      patient: loggedInPatient?.id,
      test_profile: null,
    };
  
    const validationSchema = Yup.object().shape({
      test_profile: Yup.object().required("Provide a test profile!"),
    });
  
    const handlePatientLabRequest = async (formValue, helpers) => {
      
      const payload = {
        ...formValue,
        test_profile: formValue.test_profile.value
      }
      console.log("FORM_VALUE ", payload);
      try {
        setLoading(true);
        await patientLabtestRequest(payload).then(() => {
          helpers.resetForm();
          toast.success("Lab Request sent successfully!");
          setLoading(false);
          router.push("/");
        });
      } catch (err) {
        toast.error(err);
        setLoading(false);
        console.log("PATIENT_LAB_REQ_ERROR ", err);
      }
    };
  
    useEffect(() => {
      dispatch(getAllServices());
      dispatch(getAllLabTestProfiles());
    }, []);

  return (
    <>
    <button className='px-4 py-2 rounded-lg bg-primary text-white flex gap-2 items-center' onClick={handleClickOpen}>
      <IoAddOutline /> <span>Lab Test Request</span>
    </button>
    <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="patient-lab-test-request">
          {"Request a lab test"}
        </DialogTitle>
        <DialogContent>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handlePatientLabRequest}
          >
            <Form className="md:w-full w-full h-64 mx-auto">
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} className="py-4">
                  <div>
                    <SeachableSelect
                    label="Test Profile"
                    name="test_profile"
                    options={labTestProfiles.map((labTestProfile) => ({ value: labTestProfile.id, label: `${labTestProfile?.name}` }))}
                    />
                    <ErrorMessage
                      name="test_profile"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </div>
                </Grid>
              </Grid>
              <button
                type="submit"
                className="bg-primary text-sm w-full rounded-xl px-8 py-2 text-white"
              >            
                Submit
              </button>
            </Form>
        </Formik>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddPatientLabReq