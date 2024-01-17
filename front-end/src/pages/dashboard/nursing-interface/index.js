import React from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Container } from "@mui/material";
import AuthGuard from "@/assets/hoc/auth-guard";
import NursePatientDataGrid from '@/components/dashboard/nursing-interface';


const NursingInterface = () => {
  return (
    <Container maxWidth="xl mt-8">
      <NursePatientDataGrid />
    </Container>
  );
};

NursingInterface.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default NursingInterface;
