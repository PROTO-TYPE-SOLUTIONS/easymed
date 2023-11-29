import React from "react";
import { Container } from "@mui/material";
import PatientsDataGrid from "@/components/dashboard/patient/patient-data-grid";
import DashboardLayout from "@/components/layout/dashboard-layout";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import AuthGuard from "@/assets/hoc/auth-guard";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { userPermissions } = useSelector(( store ) => store.auth)

  console.log("USER_PERMISSIONS ",userPermissions)
  return (
    <Container maxWidth="xl">
      <DashboardCards />
      <PatientsDataGrid />
    </Container>
  );
};

Dashboard.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default Dashboard;
