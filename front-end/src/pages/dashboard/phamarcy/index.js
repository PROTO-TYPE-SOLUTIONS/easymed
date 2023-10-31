import React from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Container } from "@mui/material";
import AuthGuard from "@/assets/hoc/auth-guard";

const Phamarcy = () => {
  return <Container maxWidth="xl">Phamarcy</Container>;
};

Phamarcy.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default Phamarcy;
