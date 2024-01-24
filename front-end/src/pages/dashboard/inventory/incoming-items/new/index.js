import React from 'react'
import { Container } from '@mui/material';

import AuthGuard from '@/assets/hoc/auth-guard';
import NewItems from '@/components/dashboard/inventory/incomingItems/NewItems'
import DashboardLayout from '@/components/layout/dashboard-layout';
import InventoryNav from '@/components/dashboard/inventory/nav';


const NewIncomingItem = () => {
  return (
    <Container maxWidth="xl">
        <InventoryNav />
        <NewItems/>
    </Container>
  )
}


NewIncomingItem.getLayout = (page) => (
    <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>;
    </AuthGuard>
);

export default NewIncomingItem