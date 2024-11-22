import React from 'react';
import { Container } from '@mui/material';

import AuthGuard from '@/assets/hoc/auth-guard';
import DashboardLayout from '@/components/layout/dashboard-layout';
import ProtectedRoute from '@/assets/hoc/protected-route';
import BillingNav from '@/components/dashboard/billing/BillingNav';
import BillingSettings from '@/components/dashboard/billing/billing-settings/billingSettings';

const BillingSettingsPage = () => {
  return (
    <Container>
      <BillingNav/>
      <BillingSettings />
    </Container>
    
  )
}

BillingSettingsPage.getLayout = (page) => (
  <ProtectedRoute permission={'CAN_ACCESS_BILLING_DASHBOARD'}>
    <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </AuthGuard>
  </ProtectedRoute>
);

export default BillingSettingsPage;