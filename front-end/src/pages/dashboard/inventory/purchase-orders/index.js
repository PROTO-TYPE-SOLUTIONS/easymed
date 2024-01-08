import React from 'react'
import { Container } from "@mui/material";
import InventoryNav from '@/components/dashboard/inventory/nav';
import PurchaseOrdersDatagrid from '@/components/dashboard/inventory/PurchaseOrdersDatagrid'
import AuthGuard from "@/assets/hoc/auth-guard";
import DashboardLayout from "@/components/layout/dashboard-layout";


const PurchaseOrdersPage = () => {
  return (
    <Container maxWidth="xl">
      <InventoryNav />
      <PurchaseOrdersDatagrid />
    </Container>
  )
}

PurchaseOrdersPage.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>;
  </AuthGuard>
);

export default PurchaseOrdersPage