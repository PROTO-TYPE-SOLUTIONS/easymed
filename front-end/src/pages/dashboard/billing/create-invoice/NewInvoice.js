import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Container, Grid, FormGroup } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { getAllPatients } from "@/redux/features/patients";

import LabTestRequests from './lab-test-requests';
import PrescribedDrug from './prescribed-drug';
import Appointments from './Appointments';
import ReviewInvoice from './ReviewInvoice';

const NewInvoice = () => {
    const dispatch = useDispatch()
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedAppointments, setSelectedAppointments] = useState([]);
    const [selectedLabRequests, setSelectedLabRequests] = useState([]);
    const [selectedPrescribedDrugs, setSelectedPrescribedDrugs] = useState([]);

    const { patients } = useSelector((store) => store.patient);

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    useEffect(() => {
        dispatch(getAllPatients());
        setSelectedAppointments([]);
        setSelectedLabRequests([]);
        setSelectedPrescribedDrugs([]);
    }, [selectedOption]);
  return (
    <Grid container spacing={2}>
      <Grid className='flex flex-col gap-4' item md={4} xs={12}>
        <Grid className='flex flex-col justify-center' item md={12} xs={12}>
            <h2 className='text-xl rounded-lg text-primary'>Select A Patient</h2>
            <Select
                  value={selectedOption}
                  isSearchable
                  isClearable
                  onChange={handleChange}
                  options={patients.map((patient) => ({ value: patient.id, label: `${patient.first_name} ${patient.second_name}` }))}
              />
          </Grid>

          {selectedOption ? (
            < >
              <Grid className='w-full bg-white rounded-lg ' item md={12} xs={12}>
                <Appointments setSelectedAppointments={setSelectedAppointments} patient_id={selectedOption?.value}/>
              </Grid>

              <Grid className='w-full bg-white rounded-lg ' item md={12} xs={12}>
                <LabTestRequests setSelectedLabRequests={setSelectedLabRequests} patient_id={selectedOption?.value}/>
              </Grid>

              <Grid className='w-full bg-white rounded-lg ' item md={12} xs={12}>
                <PrescribedDrug setSelectedPrescribedDrugs={setSelectedPrescribedDrugs} patient_id={selectedOption?.value}/>
              </Grid>
            </>

          ): 
          <Grid item md={12} xs={12} className='items-center h-full text-center justify-center flex'>
            <h2 className='text-2xl'> No Patient is Selected </h2>
          </Grid>
          }

          
        
      </Grid>
      <Grid className='h-[80vh]' item md={8} xs={12}>
        <ReviewInvoice 
          selectedOption={selectedOption} 
          selectedAppointments={selectedAppointments} 
          selectedLabRequests={selectedLabRequests}
          selectedPrescribedDrugs={selectedPrescribedDrugs}
          setSelectedAppointments={setSelectedAppointments}
          setSelectedPrescribedDrugs={setSelectedPrescribedDrugs}
          setSelectedLabRequests={setSelectedLabRequests}
        />
      </Grid>

    </Grid>
  )
}

export default NewInvoice