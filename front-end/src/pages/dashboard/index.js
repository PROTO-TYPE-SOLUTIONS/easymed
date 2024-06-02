import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux'

import PatientsDataGrid from "@/components/dashboard/patient/patient-data-grid";
import DashboardLayout from "@/components/layout/dashboard-layout";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import AuthGuard from "@/assets/hoc/auth-guard";
import ProtectedRoute from "@/assets/hoc/protected-route";
import AppointmentCard from "@/components/dashboard/cards/AppointmentCard";
import { getAllPatientAppointments } from "@/redux/features/appointment";
import { getAllProcesses } from "@/redux/features/patients";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { userPermissions } = useSelector(( store ) => store.auth);
  const { patientAppointments } = useSelector((store)=>store.appointment);
  const { processes } = useSelector((store)=>store.patient);
  const [appointmentState, setAppointmentState] = useState("confirmed");

  useEffect(()=>{
      dispatch(getAllPatientAppointments());
      dispatch(getAllProcesses())
  },[])

  console.log("USER_PERMISSIONS ",userPermissions)
  return (
    <Container maxWidth="xl">
      {/* <PatientsDataGrid /> */}
      <h2 className="text-2xl py-2">New Visits</h2>
      <hr class="h-px mb-8 bg-gray border-0 dark:bg-gray"></hr>

      <AppointmentCard processes={processes}/>
    </Container>
  );
};

Dashboard.getLayout = (page) => (
  <ProtectedRoute permission={'CAN_ACCESS_GENERAL_DASHBOARD'}>
    <AuthGuard>
      <DashboardLayout>{page}</DashboardLayout>
    </AuthGuard>
  </ProtectedRoute>
);

export default Dashboard;
