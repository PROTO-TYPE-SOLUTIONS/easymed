import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch  } from 'react-redux';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from "yup"

import { getAllLabTestByProcessId, getAllLabTestPanels, getAllQualitativeResultPanelsByResult, getAllResultPanelsByResult } from '@/redux/features/laboratory';
import { useAuth } from '@/assets/hooks/use-auth';
import { approveLabResult, approveQualitativeLabResult } from '@/redux/service/laboratory';
import TestsAccordion from '../TestsAccordion';
import SampleTestAccordion from '../SampleTestAccordion';
import { fetchPatientById } from '@/redux/service/patients';

const ApproveResults = ({ selectedData, approveOpen, setApproveOpen }) => {
    const [loading, setLoading] = useState(false)
    const [testPatient, setTestPatient]=useState({})
    const dispatch = useDispatch()
    const auth = useAuth()
    const { labRequestsByProcess, labTestPanels, resultPanels } = useSelector((store)=> store.laboratory)

    console.log("THE SELECTED RESULT DATA", selectedData)
    console.log("THE SELECTED RESULT DATA PANELS", resultPanels)

    const initialValues = {
        lab_results:selectedData.id,
        lab_test_request: selectedData.lab_test_request,
        approved_by: auth.user_id
    }

    const handleClose = () => {
        setApproveOpen(false);
    };

    const getPatientDetailsForThisTestRequest = async () => {
        try{
            const response = await fetchPatientById(selectedData?.patient)
            setTestPatient(response);
        }catch(error){
            console.log("ERROR GETTING PATIENT")
        }
    }

    useEffect(()=> {
        if(auth){
            dispatch(getAllLabTestPanels(auth))
            dispatch(getAllLabTestByProcessId(selectedData?.labTest, auth)) 
            getPatientDetailsForThisTestRequest()
        }
    }, [selectedData])

    const processTestRequests = labRequestsByProcess.map((testReq)=>{
        return(
            <SampleTestAccordion key={`testReq-${testReq.id}`} testReq={testReq}/>
        )
    })

    const approveLabResults = async (formValue) => {

        const payload = {
            ...formValue
        }

        try{
            setLoading(true)
            let response;
            if(selectedData.category === "quantitative"){
                response = await approveLabResult(payload, auth)
            }else{
                response = await approveQualitativeLabResult(payload, auth)
            }
            setLoading(false)
            console.log("SUCCESS APPROVAL", response)

        }catch(error){
            setLoading(false)
            console.log("FAILED APPROVAL", error)
        }

    }

  return (
    <div>
        <Dialog
            fullWidth
            maxWidth="md"
            open={approveOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                <div className='flex items-center min-h-6 px-2 bg-yellow-200 py-2'>
                    <div className='flex w-full'>
                        <p className='text-xs w-full font-semibold'>{`--id: ${testPatient.unique_id}`}</p>
                        <p className='text-xs w-full font-semibold'>{`--name: ${testPatient.first_name} ${testPatient.second_name}`}</p>
                        <p className='text-xs w-full font-semibold'>{`--phone: ${testPatient.phone}`}</p>
                        <p className='text-xs w-full font-semibold'>{`-- ${testPatient.gender}`}</p>
                        <p className='text-xs w-full font-semibold'>{`-- ${testPatient.age} years`}</p>
                    </div>
                </div>
            </DialogTitle>
            <DialogContent>
            {processTestRequests}
            </DialogContent>
        </Dialog>      
    </div>
  )
}

export default ApproveResults