import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Container } from "@mui/material";
import AuthGuard from "@/assets/hoc/auth-guard";
import DashboardLayout from "@/components/layout/dashboard-layout";
import Reports from '@/components/dashboard/billing/reports/Reports';
import BillingNav from '@/components/dashboard/billing/BillingNav';

import { getAllItems } from "@/redux/features/inventory";

const ReportsBillingPage = () => {
    const dispatch = useDispatch();
    useEffect(()=> {
        dispatch(getAllItems());
    }, [])
  return (
    <Container maxWidth="xl">
      <BillingNav />
      <Reports/>
    </Container>
    
  )
}

ReportsBillingPage.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>;
  </AuthGuard>
);

export default ReportsBillingPage