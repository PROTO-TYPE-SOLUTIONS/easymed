import React from 'react'
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';

import { useAuth } from '@/assets/hooks/use-auth';
import AuthGuard from '@/assets/hoc/auth-guard';
import PatientConfirmedProtect from '@/assets/hoc/patient-confirmed';
import ProfileLayout from '@/components/layout/profile-layout';
import UpcomingAppointments from '@/components/patient-profile/appointments/upcoming-appointments';
import OverviewNav from '@/components/patient-profile/overview/OverviewNav';

const PatientBookings = () => {
  const { appointmentsByPatientsId } = useSelector((store) => store.appointment);
  const { patients } = useSelector((store) => store.patient);
  const auth = useAuth();
  const loggedInPatient = patients.find((patient)=> patient.user === auth?.user_id)
  return (
    <AuthGuard>
      <Container className="">
        <OverviewNav/>
        <UpcomingAppointments patient={loggedInPatient} appointments={appointmentsByPatientsId}/>
      </Container>
    </AuthGuard>
  )
}

PatientBookings.getLayout = (page) => (
  <PatientConfirmedProtect>
    <ProfileLayout>{page}</ProfileLayout>
  </PatientConfirmedProtect>
);

export default PatientBookings