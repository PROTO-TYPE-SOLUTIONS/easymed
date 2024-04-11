import React, { useEffect } from "react";
import { Container } from "@mui/material";
import CustomizedLayout from "@/components/layout/customized-layout";
import DashboardLayout from "@/components/layout/dashboard-layout";
import AuthGuard from "@/assets/hoc/auth-guard";
import { getAllLabRequests, getAllLabResults, getAllQualitativeLabResults } from "@/redux/features/laboratory";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/assets/hooks/use-auth";
import LabResultDataGrid from "@/components/dashboard/laboratory/lab-results-datagrid";
import LabNav from "@/components/dashboard/laboratory/LabNav";
import ProtectedRoute from "@/assets/hoc/protected-route";
import { sortByLatest } from "@/functions/tables";
import LabRequestDataGrid from "@/components/dashboard/laboratory/lab-request-datagrid";

const LabResults = () => {
  const dispatch = useDispatch();
  const { labResults, qualitativeLabResults, labRequests } = useSelector((store) => store.laboratory);
  const token = useAuth();

  const sortedData = sortByLatest(labResults);
  const sortedQualitativeData = sortByLatest(qualitativeLabResults);

  useEffect(() => {
    if (token) {
      dispatch(getAllQualitativeLabResults(token));
      dispatch(getAllLabResults(token));
      dispatch(getAllLabRequests(token));

    }
  }, [token]);

  return (
    <Container maxWidth="xl">
      <LabNav/>
      <h1 className="uppercase text-2xl my-4">Lab Requests</h1>
      <LabRequestDataGrid labRequests={labRequests} />

      {/* <LabResultDataGrid labResults={sortedData} qualitativeLabResults={sortedQualitativeData} /> */}
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
