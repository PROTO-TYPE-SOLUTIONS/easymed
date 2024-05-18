import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogTitle, Grid } from '@mui/material'
import appointment from '@/redux/features/appointment';
import AssignDoctorModal from '../reception-interface/assign-doctor-modal';

import { LiaUserNurseSolid } from "react-icons/lia";
import { FaUserDoctor } from "react-icons/fa6";
import { BsCapsule } from "react-icons/bs";
import { GiMicroscope } from "react-icons/gi";
import { Form, Formik } from 'formik';
import LabModal from '../doctor-interface/lab-modal';
import DirectToTheLabModal from '../doctor-interface/DirectToTheLabModal';
import { updateAttendanceProcesses } from '@/redux/service/patients';
import { getAllProcesses } from '@/redux/features/patients';


const AppointmentCard = ({ processes }) => {
    const [assignOpen, setAssignOpen]=useState(false)
    const [labOpen, setLabOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    const [selectedData, setSelectedData] = useState({})
    const {patients} =  useSelector((store)=> store.patient)

    const handleClose = () => {
        setOpen(false);
    };

    const sendForTriage = (patient, process) => {
        const selectedData = {
            ...process,
            patient_name: patient.first_name + " " + patient.second_name
        }
        console.log(selectedData)
        setSelectedData(selectedData)
        setAssignOpen(true)
    }

    const sendToLab = (patient, process) => {
        const selectedData = {
            ...process,
            patient_name: patient.first_name + " " + patient.second_name
        }
        setSelectedData(selectedData)
        setLabOpen(true)
    }

    const sendToPharmacy = (patient, process) => {
        const selectedData = {
            ...process,
            patient_name: patient.first_name + " " + patient.second_name
        }
        setSelectedData(selectedData)
        setOpen(true)
    }

    const handleSendToPharmacy = async () => {
        try {
            const response = await updateAttendanceProcesses({track: "pharmacy"}, selectedData.id)
            console.log(response)
            dispatch(getAllProcesses())
            handleClose()

        }catch(error){
            console.log("Err sending to pharmacy", error)
        }
    }

    const displayInitiatedAttendanceProcesses = processes.filter((process)=> process.track === "reception").map((process)=> {

        const linkedPatient = patients.find((patient)=> patient.id === process.patient)
        console.log("APPOINTMENT FOUND", linkedPatient)
        if(linkedPatient){   
            return (
                <Grid key={`appointments_${process.id}`} item xs={4} className='bg-white py-4 px-2 rounded-lg'>
                    <div className='flex flex-col gap-2'>
                        <div className='py-2 flex flex-col gap-2'>
                            <div className='flex justify-between items-center'>
                                <LiaUserNurseSolid onClick={()=>sendForTriage(linkedPatient, process)} className='h-10 w-10 cursor-pointer'/>
                                {/* <FaUserDoctor  className='h-10 w-10 cursor-pointer'/> */}
                                <GiMicroscope onClick={()=>sendToLab(linkedPatient, process)}  className='h-10 w-10 cursor-pointer'/>
                                <BsCapsule onClick={()=>sendToPharmacy(linkedPatient, process)} className='h-10 w-10 cursor-pointer'/>
                            </div>
                        </div>
                        <div className='border-b border-gray py-2 flex flex-col gap-2'>
                            <div className=''>
                                {/* <h5 className='font-semibold text-sm text-warning'>{`${process.track}`}</h5> */}
                                <h5 className='font-medium text-xxs text-warning'>{`${process.track_number}`}</h5>
                            </div>
                            <div className='flex justify-between items-center'>
                                <h5 className='font-semibold text-sm text-primary'>{`${linkedPatient.first_name} ${linkedPatient.second_name}`}</h5>
                                <h5 className='font-semibold text-sm text-primary'>{`${linkedPatient.age}`}</h5>
                            </div>
                            <div className='flex justify-between items-center'>
                                <h5 className='font-semibold text-sm text-primary'>{`${linkedPatient.phone}`}</h5>
                                <h5 className='font-semibold text-sm text-primary'>{`${linkedPatient.gender}`}</h5>
                            </div>
                            <span className=''>{process.reason}</span>
                        </div>
                    </div>
                </Grid>
            )
        }
    })

  return (
    <>
        <div className='grid grid-cols-3 gap-4'>
            {displayInitiatedAttendanceProcesses}
        </div>
        <AssignDoctorModal {...{ assignOpen, setAssignOpen, selectedData }} />
        <DirectToTheLabModal
            {...{ labOpen, setLabOpen, selectedData }}
        />
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle>
            <p className="text-sm font-semibold">{`send ${selectedData?.patient_name} for Prescription?`}</p>
            </DialogTitle>
            <DialogContent>
                <section className="space-y-1">
                    <h2 className='w-full text-xl'>Are you sure you want to send the patient for prescription ? </h2>
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12}>
                            <div className="flex items-center gap-2 justify-end mt-3">
                                <p
                                    className="border border-warning text-sm rounded-xl px-3 py-2 cursor-pointer"
                                    onClick={handleClose}
                                >
                                Cancel
                                </p>
                                <button
                                onClick={handleSendToPharmacy}
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
                                send for prescription
                                </button>
                            </div>
                        </Grid>

                    </Grid>
                </section>
            </DialogContent>
        </Dialog>
    </>

  )
}

export default AppointmentCard