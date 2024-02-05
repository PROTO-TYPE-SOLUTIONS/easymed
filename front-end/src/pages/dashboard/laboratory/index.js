import React, { useEffect } from "react";
import { Container } from "@mui/material";
import CustomizedLayout from "@/components/layout/customized-layout";
import DashboardLayout from "@/components/layout/dashboard-layout";
import AuthGuard from "@/assets/hoc/auth-guard";
import { getAllLabResults } from "@/redux/features/laboratory";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/assets/hooks/use-auth";
import LabResultDataGrid from "@/components/dashboard/laboratory/lab-results-datagrid";
import LabNav from "@/components/dashboard/laboratory/LabNav";
import ProtectedRoute from "@/assets/hoc/protected-route";

const LabResults = () => {
  const dispatch = useDispatch();
  const { labResults } = useSelector((store) => store.laboratory);
  const token = useAuth();

  useEffect(() => {
    if (token) {
      dispatch(getAllLabResults(token));
    }
  }, [token]);

  return (
    <Container maxWidth="xl">
      <LabNav/>
      <h1 className="uppercase text-2xl my-4">Lab Results</h1>
      <LabResultDataGrid labResults={labResults} />
    </Container>
  );
};

LabResults.getLayout = (page) => (
  <ProtectedRoute permission={'CAN_ACCESS_LABORATORY_DASHBOARD'}>
    <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </AuthGuard>
  </ProtectedRoute>
);

export default LabResults;
