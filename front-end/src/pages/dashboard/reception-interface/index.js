import React from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Container } from "@mui/material";
import PatientAppointmentDataGrid from "@/components/dashboard/reception-interface/patient-appointment-datagrid";
import AuthGuard from "@/assets/hoc/auth-guard";
import { getAllPatientAppointments } from "@/redux/features/appointment";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ProtectedRoute from "@/assets/hoc/protected-route";

const ReceptionInterface = () => {
  const { patientAppointments } = useSelector(( store ) => store.appointment)
  const dispatch = useDispatch();


  useEffect(() =>{
    dispatch(getAllPatientAppointments());
  },[]);


  return (
    <Container maxWidth="xl" className="mt-8">
      <PatientAppointmentDataGrid {...{ patientAppointments }} />
    </Container>
  );
};

ReceptionInterface.getLayout = (page) => (
  <ProtectedRoute permission={'CAN_ACCESS_RECEPTION_DASHBOARD'}>
    <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </AuthGuard>
  </ProtectedRoute>
);

export default ReceptionInterface;
