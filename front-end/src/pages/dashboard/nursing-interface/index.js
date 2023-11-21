import React, { useState, useEffect } from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import { Container } from "@mui/material";
import AuthGuard from "@/assets/hoc/auth-guard";

const NursingInterface = () => {
  return (
    <Container maxWidth="xl">
      <h1>Nursing</h1>
    </Container>
  );
};

NursingInterface.getLayout = (page) => (
  <AuthGuard>
    <CustomizedLayout>{page}</CustomizedLayout>
  </AuthGuard>
);

export default NursingInterface;
