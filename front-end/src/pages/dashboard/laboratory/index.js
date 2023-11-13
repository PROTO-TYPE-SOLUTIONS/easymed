import React, { useEffect } from "react";
import { Container } from "@mui/material";
import LaboratoryDataGrid from "@/components/dashboard/laboratory/laboratory-datagrid";
import CustomizedLayout from "@/components/layout/customized-layout";
import AuthGuard from "@/assets/hoc/auth-guard";
import { getAllLabResults } from "@/redux/features/laboratory";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/assets/hooks/use-auth";

const Laboratory = () => {
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
      <h1 className="uppercase text-2xl my-4">Results</h1>
      <LaboratoryDataGrid labResults={labResults} />
    </Container>
  );
};

Laboratory.getLayout = (page) => (
  <AuthGuard>
    <CustomizedLayout>{page}</CustomizedLayout>
  </AuthGuard>
);

export default Laboratory;
