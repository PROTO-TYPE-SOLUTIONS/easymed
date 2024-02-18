import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Container, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
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
import FormikFieldDateTimePicker from '@/components/dateandtime/FormikFieldDateTimePicker';
import FileUpload from '@/components/upload/FileUpload';
import { publicLabRequest } from '@/redux/service/laboratory';

const mb = { marginBottom: 4 };

const AddPatientLabReq = () => {
    const { services } = useSelector(({ patient }) => patient);
    const { labTestProfiles } = useSelector((store) => store.laboratory);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const auth = useAuth()
    const fileRef = useRef(null);
    const { patients } = useSelector((store) => store.patient);
    const loggedInPatient = patients.find((patient)=> patient.user === auth?.user_id)

    console.log("ADD PATIENT LAB TEST REQUEST", loggedInPatient)

    const timezoneList = {
      nairobi: "Africa/Nairobi" // +3:00
    };
    const timezone = timezoneList.nairobi;

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const getGenderValue = () =>{
      if(loggedInPatient?.gender?.toLowerCase() === "male"){
        return "M"
      }else if(loggedInPatient?.gender?.toLowerCase() === "female"){
        return "F"
      }else{
        return null
      }
    }
  
    const initialValues = {
      first_name: loggedInPatient?.first_name  || "",
      second_name: loggedInPatient?.second_name  || "",
      // patient: loggedInPatient?.id  || "",
      test_profile: null,
      date_of_birth: loggedInPatient?.date_of_birth || "",
      gender: getGenderValue() || "",
      appointment_date: new Date().toISOString(),
      status: "pending",
      reason: "",
      // lab_request: null,
      sample_collected: "",
      // sample: "",
    };
  
    const validationSchema = Yup.object().shape({
      test_profile: Yup.object().required("Provide a test profile!"),
      appointment_date: Yup.string().required("Field is required!"),
      status: Yup.string().required("Field is required!"),
      reason: Yup.string().required("Field is required!"),
      sample_collected: Yup.object().required("Field is required!"),
      // sample: Yup.string().required("Field is required!"),
      // lab_request: Yup.mixed()
      // .test("is-file-too-big", "File exceeds 10MB", () => {
      //   let valid = true;
      //   const files = fileRef?.current?.files;
      //   if (files) {
      //     const fileArr = Array.from(files);
      //     fileArr.forEach((file) => {
      //       const size = file.size / 1024 / 1024;
      //       if (size > 10) {
      //         valid = false;
      //       }
      //     });
      //   }
      //   return valid;
      // })
      // .test(
      //   "is-file-of-correct-type",
      //   "File is not of supported type",
      //   () => {
      //     let valid = true;
      //     const files = fileRef?.current?.files;
      //     if (files) {
      //       const fileArr = Array.from(files);
      //       fileArr.forEach((file) => {
      //         const type = file.type.split("/")[1];
      //         const validTypes = [
      //           "pdf",
      //           "jpeg",
      //           "png",
      //           "jpg",
      //         ];
      //         if (!validTypes.includes(type)) {
      //           valid = false;
      //         }
      //       });
      //     }
      //     return valid;
      //   }
      // )
    });
  
    const handlePatientLabRequest = async (formValue, helpers) => {
      
      const payload = {
        ...formValue,
        test_profile: formValue.test_profile.value,
        sample_collected: formValue.sample_collected.value,
        // lab_request: fileRef.current.files[0]
      }
      console.log("FORM_VALUE ", payload);
      try {
        setLoading(true);
        await publicLabRequest(payload).then(() => {
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
            <Form className="md:w-full w-full mx-auto">
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} className="py-2">
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
                <Grid item md={12} xs={12} className="py-2">
                  <div>
                    <SeachableSelect
                    label="Sample Collected"
                    name="sample_collected"
                    options={[{name: "True", value: true}, {name: "False", value: false}].map((item) => ({ value: item?.value, label: `${item?.name}` }))}
                    />
                    <ErrorMessage
                      name="sample_collected"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </div>
                </Grid>
                <Grid item md={12} xs={12}>
                  <div className="w-full">
                    <label htmlFor="appointment_date">Appointment Date</label>
                    <Field
                      className="block border text-sm border-gray rounded-lg py-2 px-4 focus:outline-none w-full"
                      type="date"
                      placeholder="Appointment Date"
                      name="appointment_date"
                    />
                    <ErrorMessage
                      name="appointment_date"
                      component="div"
                      className="text-warning text-xs"
                    />
                  </div>
                </Grid>
                {/* <Grid item md={12} xs={12} className='py-2'>
                  <Typography variant="subtitle1" gutterBottom style={mb}>
                    add request pdf
                  </Typography>
                  <FileUpload name="lab_request" fileRef={fileRef} />
                </Grid> */}
                <Grid item md={12} xs={12} className='py-2'>
                  <div>
                    <Field
                      className="border border-gray focus:outline-none rounded-lg p-4 w-full"
                      as="textarea"
                      type="text"
                      rows={3}
                      placeholder="Reason"
                      name="reason"                    
                    />
                    <ErrorMessage
                      name='reason'
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