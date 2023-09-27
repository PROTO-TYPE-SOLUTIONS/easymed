import PatientDataGrid from '@/components/dashboard/patient/patient-data-grid'
import { Container } from '@mui/material'
import React from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'

const Patient = () => {
  return (
    <Container maxWidth="xl">
    <PatientDataGrid />
    </Container>
  )
}

Patient.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export default Patient