import React, { useState, useEffect } from 'react'
import { Grid,Chip, Dialog, DialogTitle, DialogContent, Checkbox } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { fetchLabRequestsDetails, fetchLabTestPanelsByTestRequestId, sendLabRequestsPanels, updateLabRequest } from '@/redux/service/laboratory';
import { useAuth } from '@/assets/hooks/use-auth';
import { getAllLabTestByProcessId, getAllLabTestPanels, getAllLabTestPanelsByProfile, getAllLabTestPanelsByTestRequest, setProcessAllTestRequest, clearProcessAllTestRequest, getAllSamplesForProcessId } from '@/redux/features/laboratory';
import { useSelector, useDispatch } from 'react-redux';
import TestsAccordion from './TestsAccordion';
import { fetchPatientById } from '@/redux/service/patients';
import SampleTestAccordion from './SampleTestAccordion';

const RequestInfoModal = ({requestInfoOpen, setRequestInfoOpen, selectedRowData}) => {
    const [loading, setLoading] = useState(false);
    const { labSamplesByProcess, labTestPanelsById} = useSelector((store) => store.laboratory);
    const [labTest, setLabTest]=useState({})
    const [testProfile, setTestProfile]= useState(null)
    const [selectedPanels, setSelectedPanels] = useState([]);
    const [testPatient, setTestPatient]=useState({})
    const [processPanels, setProcessPanels] = useState([])

    const auth = useAuth();
    const dispatch = useDispatch();
    const { labResultItems, labTestPanels, processAllTestRequest } = useSelector((store)=> store.laboratory)

    console.log("ROW DATA IS THE FOLLOWING", selectedRowData)
    console.log("PANELS FOR A LAB REQUEST", labResultItems)
    console.log("ALL THE PANELS", testPatient)
    console.log("THIS ARE THE TESTS", labSamplesByProcess)

    const initialValues = {
        sample: "",
        test_profile: null,
    }

    const sampleOnlyInitialValues = {
        sample: "",
    }
    const initials = labResultItems.length <=0 ? initialValues : sampleOnlyInitialValues
    console.log("THZ ARE THE INITILAS", initials)
    const validationSchema = Yup.object().shape({
      sample: Yup.string().required("This field is required!"),
      test_profile:Yup.number().required("This field is required!"),
    });
    const sampleOnlyValidationSchema = Yup.object().shape({
        sample: Yup.string().required("This field is required!"),
    });
    const schema = labResultItems.length<=0 ? validationSchema : sampleOnlyValidationSchema
    console.log("THIS IS THE SCHEMA", schema)

    const handleClose = () => {
        setRequestInfoOpen(false);
    };

    const getPatientDetailsForThisTestRequest = async () => {
        try{
            const response = await fetchPatientById(selectedRowData?.patient)
            setTestPatient(response);
        }catch(error){
            console.log("ERROR GETTING PATIENT")
        }
    }

    const saveAllPanels = async (testReqPanelPayload) => {
        try{
          await sendLabRequestsPanels(testReqPanelPayload, auth)
          toast.success("Lab Request Panels saved Successful!");
        }catch(error){
          console.log(error)
          toast.error(error)
        }
    }

    const savePanels = (reqId) => {
        selectedPanels.forEach((panel)=> {
          const testReqPanelPayload = {    
            test_panel: panel.id,
            lab_test_request: reqId      
          }
          saveAllPanels(testReqPanelPayload);
        })
    }

    const updateTestRequest = async (formValue) => {
        console.log("THE FORMVALUE TO DB", formValue)
        const payload = {
            ...formValue,
            sample_collected: true
        }

        const sampleOnly = {
            sample: formValue.sample,
            sample_collected: true
        }

        const payloadSent = formValue.test_profile ? payload : sampleOnly

        console.log("THE PAYLOAD TO DB", payloadSent)
        setLoading(true)
        try{
            await updateLabRequest(selectedRowData.labTest,payloadSent, auth )
            toast.success("successfully saved test")
            savePanels(selectedRowData.labTest)
            setLoading(false)
            handleClose()
        }catch(error){
            toast.error("error updating test")
            setLoading(false)
        }
    }



    const handleCheckboxChange = (panel) => {
        setSelectedPanels((prevSelectedPanels) => {
          const isSelected = prevSelectedPanels.find((panelItem=>panelItem.id === panel.id));
    
          return isSelected
            ? prevSelectedPanels.filter((item) => item.id !== panel.id)
            : [...prevSelectedPanels, panel];
        });
    };

    const handleSelectAllChange = () => {
        setSelectedPanels((prevSelectedPanels) =>
          prevSelectedPanels.length === labTestPanelsById.length
            ? [] // Unselect all if all are currently selected
            : labTestPanelsById.map((panel) => panel) // Select all if not all are currently selected
        );
    };

    const getTestPanelsByTheProfileId = async (testProfile, auth) => {
        try{
        const response = await fetchLabTestPanelsByProfileId(testProfile, auth)
        setSelectedPanels(response);
        }catch(error){

        }
    }

    const labTestDetails = async (test_id, auth) => {
        try{
            const response = await fetchLabRequestsDetails(test_id, auth)
            setLabTest(response)
            
        }catch(error){
            console.log("ERROR GETTING LABTEST DETAILS", error)
        }
    }

    const labTestPanelsForSpecificTest = async (test_id, auth) => {
        try{
            dispatch(getAllLabTestPanelsByTestRequest (test_id, auth))          
        }catch(error){
            console.log("ERROR GETTING LABTEST DETAILS", error)
        }
    }

    useEffect(()=> {
        if(auth){
            dispatch(getAllLabTestPanels(auth))
            labTestDetails(selectedRowData?.labTest, auth)
            dispatch(getAllSamplesForProcessId(selectedRowData?.id, auth)) 
            getPatientDetailsForThisTestRequest()
        }
    }, [selectedRowData, testProfile])

    const processTestRequests = labSamplesByProcess.map((sample)=>{
        return(
            <TestsAccordion key={`phlebotomy-sample-${sample.id}`} sample={sample}/>
        )
    })

  return (
    <div>
        <Dialog
            fullWidth
            maxWidth="md"
            open={requestInfoOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                <div className='flex items-center min-h-6 justify-between px-2 bg-yellow-200 py-2'>
                    <div>
                        <p className='text-xs font-semibold'>{`-- ${testPatient.first_name} ${testPatient.second_name}`}</p>
                        <p className='text-xs font-semibold'>{`-- ${testPatient.email}`}</p>
                        <p className='text-xs font-semibold'>{`-- ${testPatient.phone}`}</p>
                        <p className='text-xs font-semibold'>{`-- ${testPatient.gender}`}</p>
                        <p className='text-xs font-semibold'>{`-- ${testPatient.age}`}</p>
                    </div>
                    <div>
                        <p className='text-xs font-semibold'>{`-- ${testPatient.first_name} ${testPatient.second_name}`}</p>
                        <p className='text-xs font-semibold'>{`-- ${testPatient.email}`}</p>
                        <p className='text-xs font-semibold'>{`-- ${testPatient.phone}`}</p>
                        <p className='text-xs font-semibold'>{`-- ${testPatient.gender}`}</p>
                        <p className='text-xs font-semibold'>{`-- ${testPatient.age}`}</p>
                    </div>
                </div>
            </DialogTitle>
            <DialogContent>
                <h2 className='text-sm font-bold text-primary w-1/3 mb-4 border-gray border-b px-4'>Requested Tests</h2>
                {processTestRequests}
            </DialogContent>
        </Dialog>      
    </div>
  )
}

export default RequestInfoModal
