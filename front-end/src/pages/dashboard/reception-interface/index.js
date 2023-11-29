import React from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import { Container } from "@mui/material";
import PatientAppointmentDataGrid from "@/components/dashboard/reception-interface/patient-appointment-datagrid";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import AuthGuard from "@/assets/hoc/auth-guard";
import { getAllPatientAppointments } from "@/redux/features/appointment";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const ReceptionInterface = () => {
  const { patientAppointments } = useSelector(( store ) => store.appointment)
  const dispatch = useDispatch();


  useEffect(() =>{
    dispatch(getAllPatientAppointments());
  },[]);


  return (
    <Container maxWidth="xl" className="mt-8">
      <DashboardCards />
      <PatientAppointmentDataGrid {...{ patientAppointments }} />
    </Container>
  );
};

ReceptionInterface.getLayout = (page) => (
  <AuthGuard>
    <CustomizedLayout>{page}</CustomizedLayout>
  </AuthGuard>
);

export default ReceptionInterface;
