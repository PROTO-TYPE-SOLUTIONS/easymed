import React,{useState} from 'react'
import CustomizedLayout from "../../../components/layout/customized-layout";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Container } from '@mui/material';
import BilledDataGrid from './billed-datagrid';

import BillingNav from '@/components/dashboard/billing/BillingNav';


const Billing = () => {

  return (
    <Container maxWidth="xl" className='my-8'>
      <BillingNav/>
      <BilledDataGrid />
    </Container>
  )
}

Billing.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export default Billing