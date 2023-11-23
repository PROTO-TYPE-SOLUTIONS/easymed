import React from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import { Container } from "@mui/material";
import AuthGuard from "@/assets/hoc/auth-guard";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import NursePatientDataGrid from '@/components/dashboard/nursing-interface';


const NursingInterface = () => {
  return (
    <Container maxWidth="xl">
      <DashboardCards />
      <NursePatientDataGrid />
    </Container>
  );
};

NursingInterface.getLayout = (page) => (
  <AuthGuard>
    <CustomizedLayout>{page}</CustomizedLayout>
  </AuthGuard>
);

export default NursingInterface;
