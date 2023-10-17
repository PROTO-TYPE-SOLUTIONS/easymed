import React from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import { Container, Grid } from "@mui/material";
import { AiOutlineRight } from "react-icons/ai";
import DoctorPatientDataGrid from "@/components/dashboard/doctor-interface/doctor-patient-datagrid";
import DashboardCards from "@/components/dashboard/dashboard-cards";

const DoctorInterface = () => {
  return (
    <Container maxWidth="xl" className="mt-8">
      <DashboardCards />
      <DoctorPatientDataGrid />
    </Container>
  );
};

DoctorInterface.getLayout = (page) => (
  <CustomizedLayout>{page}</CustomizedLayout>
);

export default DoctorInterface;
