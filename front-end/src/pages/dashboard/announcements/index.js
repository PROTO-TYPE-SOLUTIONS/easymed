import React from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Container } from "@mui/material";
import AuthGuard from "@/assets/hoc/auth-guard";

const Schedule = () => {
  return <Container maxWidth="xl">Schedule</Container>;
};

Schedule.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);
export default Schedule;
