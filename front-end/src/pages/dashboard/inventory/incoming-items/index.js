import React from 'react'
import { Container } from "@mui/material";
import InventoryNav from '@/components/dashboard/inventory/nav';
import AuthGuard from "@/assets/hoc/auth-guard";
import DashboardLayout from "@/components/layout/dashboard-layout";
import IncomingItemsGrid from '@/components/dashboard/inventory/incomingItems/IncomingItemsGrid';


const IncomingItemsPage = () => {
  return (
    <Container maxWidth="xl">
      <InventoryNav />
      <IncomingItemsGrid />
    </Container>
    
  )
}

IncomingItemsPage.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>;
  </AuthGuard>
);

export default IncomingItemsPage