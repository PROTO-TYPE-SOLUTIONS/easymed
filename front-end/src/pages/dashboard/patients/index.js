import PatientDataGrid from "@/components/dashboard/patient/patient-data-grid";
import { Container } from "@mui/material";
import React from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import DashboardLayout from "@/components/layout/dashboard-layout";
import AuthGuard from "@/assets/hoc/auth-guard";

const Patient = () => {
  
  return (
    <Container maxWidth="xl">
      <PatientDataGrid />
    </Container>
  );
};

Patient.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default Patient;
