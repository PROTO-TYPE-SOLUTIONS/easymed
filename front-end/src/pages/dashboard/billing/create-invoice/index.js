import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Container, Grid, FormGroup } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { getAllPatients } from "@/redux/features/patients";

import DashboardLayout from '@/components/layout/dashboard-layout';
import AuthGuard from '@/assets/hoc/auth-guard';

import LabTestRequests from './lab-test-requests';
import PrescribedDrug from './prescribed-drug';
import Appointments from './Appointments';
import CustomizedLayout from '@/components/layout/customized-layout';
import ReviewInvoice from './ReviewInvoice';
import BillingNav from '@/components/dashboard/billing/BillingNav';
import NewInvoice from './NewInvoice';

const CreateNewInvoice = () => {
    const dispatch = useDispatch()
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        dispatch(getAllPatients());
        setSelectedAppointments([]);
        setSelectedLabRequests([]);
        setSelectedPrescribedDrugs([]);
    }, [selectedOption]);
    

  return (
    <Container className='my-8' maxWidth="xl">
      <BillingNav/>
      <NewInvoice/>
    </Container>    
  )
}

CreateNewInvoice.getLayout = (page) => (
    <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>;
    </AuthGuard>
);

export default CreateNewInvoice;