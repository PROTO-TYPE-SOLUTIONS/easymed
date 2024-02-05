import React from "react";
import { Container } from "@mui/material";
import PatientsDataGrid from "@/components/dashboard/patient/patient-data-grid";
import DashboardLayout from "@/components/layout/dashboard-layout";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import AuthGuard from "@/assets/hoc/auth-guard";
import { useSelector } from "react-redux";
import ProtectedRoute from "@/assets/hoc/protected-route";

const Dashboard = () => {
  const { userPermissions } = useSelector(( store ) => store.auth)

  console.log("USER_PERMISSIONS ",userPermissions)
  return (
    <Container maxWidth="xl">
      <PatientsDataGrid />
    </Container>
  );
};

Dashboard.getLayout = (page) => (
  <ProtectedRoute permission={'CAN_ACCESS_GENERAL_DASHBOARD'}>
    <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </AuthGuard>
  </ProtectedRoute>
);

export default Dashboard;
