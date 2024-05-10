import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Dialog, DialogContent, Grid } from '@mui/material'
import appointment from '@/redux/features/appointment';
import AssignDoctorModal from '../reception-interface/assign-doctor-modal';

import { LiaUserNurseSolid } from "react-icons/lia";
import { FaUserDoctor } from "react-icons/fa6";
import { BsCapsule } from "react-icons/bs";
import { GiMicroscope } from "react-icons/gi";
import { Form, Formik } from 'formik';
import LabModal from '../doctor-interface/lab-modal';
import DirectToTheLabModal from '../doctor-interface/DirectToTheLabModal';


const AppointmentCard = ({ processes }) => {
    const [assignOpen, setAssignOpen]=useState(false)
    const [labOpen, setLabOpen] = useState(false);
    const [selectedData, setSelectedData] = useState({})
    const {patients} =  useSelector((store)=> store.patient)

    const handleClose = () => {
        setAssignOpen(false);
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
                                <BsCapsule className='h-10 w-10 cursor-pointer'/>
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
    </>

  )
}

export default AppointmentCard