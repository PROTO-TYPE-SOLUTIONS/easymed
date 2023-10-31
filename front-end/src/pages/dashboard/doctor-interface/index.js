import React from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import { Container } from "@mui/material";
import DoctorPatientDataGrid from "@/components/dashboard/doctor-interface/doctor-patient-datagrid";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import AuthGuard from "@/assets/hoc/auth-guard";

const DoctorInterface = () => {
  return (
    <Container maxWidth="xl" className="mt-8">
      <DashboardCards />
      <DoctorPatientDataGrid />
    </Container>
  );
};

DoctorInterface.getLayout = (page) => (
  <AuthGuard>
    <CustomizedLayout>{page}</CustomizedLayout>
  </AuthGuard>
);

export default DoctorInterface;
