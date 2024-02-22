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
    <FormGroup>
    <Grid container spacing={4}>
      <Grid item md={4} xs={12}>
        <Grid item md={12} xs={12}>
            <h2 className='text-xl px-2 rounded-lg text-primary'>Select A Patient</h2>
            <Select
                  value={selectedOption}
                  isSearchable
                  isClearable
                  onChange={handleChange}
                  options={patients.map((patient) => ({ value: patient.id, label: `${patient.first_name} ${patient.second_name}` }))}
              />
          </Grid>

          {selectedOption ? (
            <>
              <Grid item md={12} xs={12}>
                <Appointments setSelectedAppointments={setSelectedAppointments} patient_id={selectedOption?.value}/>
              </Grid>

              <Grid item md={12} xs={12}>
                <LabTestRequests setSelectedLabRequests={setSelectedLabRequests} patient_id={selectedOption?.value}/>
              </Grid>

              <Grid item md={12} xs={12}>
                <PrescribedDrug setSelectedPrescribedDrugs={setSelectedPrescribedDrugs} patient_id={selectedOption?.value}/>
              </Grid>
            </>

          ): 
          <Grid item md={12} xs={12} className='items-center h-full text-center justify-center flex'>
            <h2 className='text-2xl'> No Patient is Selected </h2>
          </Grid>
          }

          
        
      </Grid>
      <Grid item md={8} xs={12}>
        <ReviewInvoice 
          selectedOption={selectedOption} 
          selectedAppointments={selectedAppointments} 
          selectedLabRequests={selectedLabRequests}
          selectedPrescribedDrugs={selectedPrescribedDrugs}
        />
      </Grid>

    </Grid>
  </FormGroup>
  )
}

export default NewInvoice