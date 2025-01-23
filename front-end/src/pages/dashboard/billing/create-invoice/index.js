import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Container, Grid, FormGroup } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { getAllPatients } from "@/redux/features/patients";

import DashboardLayout from '@/components/layout/dashboard-layout';
import AuthGuard from '@/assets/hoc/auth-guard';

import BillingNav from '@/components/dashboard/billing/BillingNav';
import NewInvoice from './NewInvoice';
import ProtectedRoute from '@/assets/hoc/protected-route';
import { useAuth } from '@/assets/hooks/use-auth';

const CreateNewInvoice = () => {
    const auth = useAuth()

  return (
    <Container className='my-8' maxWidth="xl">
      <BillingNav/>
      <NewInvoice/>
    </Container>    
  )
}

CreateNewInvoice.getLayout = (page) => (
  <ProtectedRoute permission={'CAN_ACCESS_BILLING_DASHBOARD'}>
    <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>;
    </AuthGuard>
  </ProtectedRoute>
);

export default CreateNewInvoice;