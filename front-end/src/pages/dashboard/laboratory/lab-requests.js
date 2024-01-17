import React, { useEffect } from "react";
import { Container } from "@mui/material";
import CustomizedLayout from "@/components/layout/customized-layout";
import DashboardLayout from "@/components/layout/dashboard-layout";
import AuthGuard from "@/assets/hoc/auth-guard";
import { getAllLabRequests, getAllLabResults } from "@/redux/features/laboratory";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/assets/hooks/use-auth";
import LabRequestDataGrid from "@/components/dashboard/laboratory/lab-request-datagrid";

const LabRequests = () => {
  const dispatch = useDispatch();
  const { labRequests } = useSelector((store) => store.laboratory);

  const token = useAuth();

  useEffect(() => {
    if (token) {
      dispatch(getAllLabRequests(token));
    }
  }, [token]);

  return (
    <Container maxWidth="xl">
      <h1 className="uppercase text-2xl my-3">Lab Requests</h1>
      <LabRequestDataGrid labRequests={labRequests} />
    </Container>
  );
};

LabRequests.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default LabRequests;
