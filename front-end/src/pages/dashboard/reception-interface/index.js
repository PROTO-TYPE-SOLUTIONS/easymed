import React from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import { Container } from "@mui/material";
import ReceptionPatientsDataGrid from "@/components/dashboard/reception-interface/reception-patient-datagrid";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import AuthGuard from "@/assets/hoc/auth-guard";

const ReceptionInterface = () => {
  return (
    <Container maxWidth="xl" className="mt-8">
      <DashboardCards />
      <ReceptionPatientsDataGrid />
    </Container>
  );
};

ReceptionInterface.getLayout = (page) => (
  <AuthGuard>
    <CustomizedLayout>{page}</CustomizedLayout>
  </AuthGuard>
);

export default ReceptionInterface;
