import React from "react";
import { Container } from "@mui/material";
import LaboratoryDataGrid from "@/components/dashboard/laboratory/laboratory-datagrid";
import CustomizedLayout from "@/components/layout/customized-layout";
import AuthGuard from "@/assets/hoc/auth-guard";

const Laboratory = () => {
  return (
    <Container maxWidth="xl">
      <h1 className="uppercase text-2xl my-4">Results</h1>
      <LaboratoryDataGrid />
    </Container>
  );
};

Laboratory.getLayout = (page) => (
  <AuthGuard>
    <CustomizedLayout>{page}</CustomizedLayout>
  </AuthGuard>
);

export default Laboratory;
