import React,{useState} from 'react'
import CustomizedLayout from "../../../components/layout/customized-layout";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Container } from '@mui/material';
import BilledDataGrid from './billed-datagrid';

import BillingNav from '@/components/dashboard/billing/BillingNav';
import ProtectedRoute from '@/assets/hoc/protected-route';
import AuthGuard from '@/assets/hoc/auth-guard';


const Billing = () => {

  return (
    <Container maxWidth="xl" className='my-8'>
      <BillingNav/>
      <BilledDataGrid />
    </Container>
  )
}

Billing.getLayout = (page) => (
  <ProtectedRoute permission={'CAN_ACCESS_BILLING_DASHBOARD'}>
    <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </AuthGuard>
  </ProtectedRoute>
)

export default Billing