import React from 'react';
import { Container } from '@mui/material';

import AuthGuard from '@/assets/hoc/auth-guard';
import AddTestResults from '@/components/dashboard/laboratory/add-result/AddTestResults';
import DashboardLayout from '@/components/layout/dashboard-layout';
import LabNav from '@/components/dashboard/laboratory/LabNav';

const AddTestResultsPage = () => {
  return (
    <Container>
      <LabNav/>
      <AddTestResults />
    </Container>
    
  )
}

AddTestResultsPage.getLayout = (page) => (
    <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </AuthGuard>
);

export default AddTestResultsPage;