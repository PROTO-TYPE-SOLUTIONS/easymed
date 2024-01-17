import React, { useState, useEffect } from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Container, TextField, Button } from "@mui/material";
import AuthGuard from "@/assets/hoc/auth-guard";

const Messages = () => {
  return (
    <Container maxWidth="xl">
      <h1>AI Assistant</h1>
    </Container>
  );
};

Messages.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default Messages;
