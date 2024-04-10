import React from 'react'
import { Container } from '@mui/material';
import AuthGuard from '@/assets/hoc/auth-guard';
import ProtectedRoute from '@/assets/hoc/protected-route';
import DashboardLayout from '@/components/layout/dashboard-layout';
import BillingNav from '@/components/dashboard/billing/BillingNav';
import OverdueInvoicesDatagrid from '@/components/dashboard/billing/overdue-invoices/OverdueInvoiceDatagrid';

const OverdueInvoicesPage = () => {
  return (
    <Container className='my-8' maxWidth="xl">        
        <BillingNav />
        <OverdueInvoicesDatagrid/>
    </Container>
  )
}

OverdueInvoicesPage.getLayout = (page) => (
    <ProtectedRoute permission={'CAN_ACCESS_BILLING_DASHBOARD'}>
      <AuthGuard>
        <DashboardLayout>{page}</DashboardLayout>;
      </AuthGuard>
    </ProtectedRoute>
  );

export default OverdueInvoicesPage;