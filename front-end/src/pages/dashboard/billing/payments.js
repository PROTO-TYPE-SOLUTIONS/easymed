import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Container } from "@mui/material";
import AuthGuard from "@/assets/hoc/auth-guard";
import DashboardLayout from "@/components/layout/dashboard-layout";
import BillingNav from '@/components/dashboard/billing/BillingNav';

import { getAllItems } from "@/redux/features/inventory";
import { useAuth } from '@/assets/hooks/use-auth';
import InvoicePayModal from '@/components/dashboard/billing/invoicePayModal';

const ReceivePaymentsPage = () => {
    const dispatch = useDispatch();
    const auth = useAuth()
    useEffect(()=> {
        dispatch(getAllItems(auth));
    }, [])
  return (
    <Container maxWidth="xl">
      <BillingNav />
      <InvoicePayModal/>
    </Container>
    
  )
}

ReceivePaymentsPage.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>;
  </AuthGuard>
);

export default ReceivePaymentsPage