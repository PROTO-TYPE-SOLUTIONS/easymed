import React from 'react'
import { Container } from '@mui/material';
import Link from 'next/link';

import AuthGuard from '@/assets/hoc/auth-guard';
import DashboardLayout from '@/components/layout/dashboard-layout';
import PhamarcyNav from '@/components/dashboard/pharmacy/PhamarcyNav';
import NewInvoice from '../../billing/create-invoice/NewInvoice';

const PharmacyCreateInvoice = () => {
  return (
    <Container maxWidth="xl">
      <PhamarcyNav/>
      <NewInvoice/>
    </Container>
  )
}

PharmacyCreateInvoice.getLayout = (page) => (
  <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>;
  </AuthGuard>
);

export default PharmacyCreateInvoice