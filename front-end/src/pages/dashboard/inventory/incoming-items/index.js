import React from 'react'
import { Container } from "@mui/material";
import InventoryNav from '@/components/dashboard/inventory/nav';
import AuthGuard from "@/assets/hoc/auth-guard";
import DashboardLayout from "@/components/layout/dashboard-layout";


const IncomingItemsPage = () => {
  return (
    <Container maxWidth="xl">
      <InventoryNav />
      <div>incoming items</div>
    </Container>
    
  )
}

IncomingItemsPage.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>;
  </AuthGuard>
);

export default IncomingItemsPage