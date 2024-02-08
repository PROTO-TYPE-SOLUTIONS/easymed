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

const Dashboard = () => {
  const dispatch = useDispatch();
  const { userPermissions } = useSelector(( store ) => store.auth);
  const { patientAppointments } = useSelector((store)=>store.appointment);
  const [appointmentState, setAppointmentState] = useState("pending");

  const appointments = patientAppointments.filter((appointment)=> appointment.status === appointmentState )

  useEffect(()=>{
      dispatch(getAllPatientAppointments());
  },[])

  console.log("USER_PERMISSIONS ",userPermissions)
  return (
    <Container maxWidth="xl">
      {/* <PatientsDataGrid /> */}
      <h2 className="text-2xl py-2">Appointments</h2>

      <div className="w-full flex gap-8">
        <p onClick={()=>setAppointmentState("pending")} className={`px-4 py-1 ${appointmentState === "pending" ? "border-b-2 text-primary_light border-primary_light": ""} text-lg cursor-pointer`}>Upcoming</p>
        <p onClick={()=>setAppointmentState("confirmed")} className={`px-4 py-1 ${appointmentState === "confirmed" ? "border-b-2 text-primary_light border-primary_light": ""} text-lg cursor-pointer`}>Completed</p>
        <p onClick={()=>setAppointmentState("cancelled")} className={`px-4 py-1 ${appointmentState === "cancelled" ? "border-b-2 text-primary_light border-primary_light": ""} text-lg cursor-pointer`}>Cancelled</p>
      </div>
      <hr class="h-px mb-8 bg-gray border-0 dark:bg-gray"></hr>

      <AppointmentCard appointments={appointments}/>
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
