import React from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import { Container } from "@mui/material";
import DoctorPatientDataGrid from "@/components/dashboard/doctor-interface/doctor-patient-datagrid";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import AuthGuard from "@/assets/hoc/auth-guard";
import ProtectedRoute from "@/assets/hoc/protected-route";

const DoctorInterface = () => {
  return (
    <Container maxWidth="xl" className="mt-8">
      <DashboardCards />
      <DoctorPatientDataGrid />
    </Container>
  );
};

DoctorInterface.getLayout = (page) => (
  <ProtectedRoute permission={'CAN_ACCESS_DOCTOR_DASHBOARD'}>
    <AuthGuard>
      <CustomizedLayout>{page}</CustomizedLayout>
    </AuthGuard>
  </ProtectedRoute>
);

export default DoctorInterface;
