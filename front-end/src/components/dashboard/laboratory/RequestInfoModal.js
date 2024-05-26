import React, { useState, useEffect } from 'react'
import { Grid,Chip, Dialog, DialogTitle, DialogContent, Checkbox } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { fetchLabRequestsDetails, fetchLabTestPanelsByTestRequestId, sendLabRequestsPanels, updateLabRequest } from '@/redux/service/laboratory';
import { useAuth } from '@/assets/hooks/use-auth';
import { getAllLabTestByProcessId, getAllLabTestPanels, getAllLabTestPanelsByProfile, getAllLabTestPanelsByTestRequest } from '@/redux/features/laboratory';
import { useSelector, useDispatch } from 'react-redux';
import TestsAccordion from './TestsAccordion';
import { fetchPatientById } from '@/redux/service/patients';

const RequestInfoModal = ({requestInfoOpen, setRequestInfoOpen, selectedRowData}) => {
    const [loading, setLoading] = useState(false);
    const { labTestProfiles, labTestPanelsById, labRequestsByProcess } = useSelector((store) => store.laboratory);
    const [labTest, setLabTest]=useState({})
    const [testProfile, setTestProfile]= useState(null)
    const [selectedPanels, setSelectedPanels] = useState([]);
    const [testPatient, setTestPatient]=useState({})

    const auth = useAuth();
    const dispatch = useDispatch();
    const { labResultItems, labTestPanels } = useSelector((store)=> store.laboratory)

    console.log("ROW DATA IS THE FOLLOWING", selectedRowData)
    console.log("PANELS FOR A LAB REQUEST", labResultItems)
    console.log("ALL THE PANELS", testPatient)
    console.log("THIS ARE THE TESTS", selectedRowData)

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
            dispatch(getAllLabTestByProcessId(selectedRowData?.labTest, auth)) 
            getPatientDetailsForThisTestRequest()
            // labTestPanelsForSpecificTest(selectedRowData?.labTest, auth)
        }
            if(testProfile){
                getTestPanelsByTheProfileId(testProfile, auth);
                dispatch(getAllLabTestPanelsByProfile(testProfile, auth));
              }
    }, [selectedRowData, testProfile])

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
            {/* <DialogContent>
            {labResultItems.length>0 && (<div>
            <h2 className='text-sm font-bold text-primary w-1/3 mb-4 border-gray border-b px-4'>Requested Tests</h2>
            <ul className='flex gap-3 flex-col px-4'>
                <li className='flex justify-between '>
                    <span className='text-primary w-full'>panel name</span>
                    <span className='text-primary w-full'>unit</span>
                    <span className='text-primary w-full'>Ref Val High</span>
                    <span className='text-primary w-full'>Ref Val Low</span>
                </li>
                {labResultItems.map((item)=> {                
                    const foundPanel = labTestPanels.find((panel)=>panel.id === item.test_panel)
                    if(foundPanel){
                        return(
                            <li key={`${foundPanel.id}_panel`} className='flex justify-between '>
                                <span className='w-full'>{foundPanel.name}</span>
                                <span className='w-full'>{foundPanel.unit}</span>
                                <span className='w-full'>127</span>
                                <span className='w-full'>110</span>
                            </li>
                        )
                    }

                })}
            </ul>
            </div>)}
            {labTest.sample_collected && (<div className='border-gray border-b flex justify-between items-center px-4 my-4 py-1'>
                <h2 className='text-sm text-primary font-bold '>Collected Samples</h2>
                <button className='w-8 h-8 rounded-full bg-background hover:bg-white'>+</button>
            </div>)}
            <div className='px-4'>
                { labTest.sample_collected && (labTest.sample)}
            </div>
            {!labTest.sample_collected && (<Formik
                initialValues={initials}
                validationSchema={schema}
                onSubmit={updateTestRequest}
            >
                {({ values, handleChange }) => (
                <Form>

                <Grid container spacing={2} className='my-2 flex items-center'>
                {labResultItems.length<=0 && (<Grid item md={12} xs={12}>
                        <section className="space-y-3">
                        <div>
                            <Field
                            as="select"
                            className="block text-sm pr-9 border border-gray rounded-xl py-2 px-4 focus:outline-none w-full"
                            onChange={(e) => {
                                handleChange(e);
                                setTestProfile(e.target.value);
                            }}
                            name="test_profile"
                            >
                            <option value="">Select Test Profile</option>
                            {labTestProfiles.map((test, index) => (
                                <option key={index} value={test.id}>
                                {test?.name}
                                </option>
                            ))}
                            </Field>
                            <ErrorMessage
                            name="test_profile"
                            component="div"
                            className="text-warning text-xs"
                            />
                        </div>
                        {testProfile && (
                            <div>
                            <label>Select Panels</label>
                            <div className="flex items-center">
                                <Checkbox
                                checked={selectedPanels.length === labTestPanelsById.length}
                                onChange={handleSelectAllChange}
                                />
                                <span>{selectedPanels.length === labTestPanelsById.length ? "unselect all" : "select all"}</span>
                            </div>
                            <Grid container spacing={4}>
                                {labTestPanelsById.map((panel) => (
                                <Grid className="flex items-center" key={panel.id} item xs={4}>
                                    <Checkbox
                                    checked={selectedPanels.some((panelItem) => panelItem.id === panel.id)}
                                    onChange={() => handleCheckboxChange(panel)}
                                    />
                                    <span>{panel.name}</span>
                                </Grid>
                                ))}
                            </Grid>
                            </div>
                        )}
                        </section>
                    </Grid>)}
                    <Grid item md={12} xs={12}>
                    <label>sample name</label>
                    <Field
                        className="block border rounded-lg text-sm border-gray py-2 px-4 focus:outline-card w-full"
                        maxWidth="sm"
                        placeholder="Sample Name"
                        name="sample"
                    />
                    <ErrorMessage
                        name="sample"
                        component="div"
                        className="text-warning text-xs"
                    />  
                    </Grid>
                </Grid>

                <button
                    type="submit"
                    className="bg-[#02273D] px-4 py-2 rounded-xl text-white text-sm"
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
                    
                    {labResultItems.length > 0 ? "collect sample" : "update test"}
                </button>
                </Form>)}
            </Formik>)}
            </DialogContent> */}
            <DialogContent>
                <h2 className='text-sm font-bold text-primary w-1/3 mb-4 border-gray border-b px-4'>Requested Tests</h2>
                <TestsAccordion/>
            </DialogContent>
        </Dialog>      
    </div>
  )
}

export default RequestInfoModal
