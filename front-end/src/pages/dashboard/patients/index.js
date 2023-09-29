import PatientDataGrid from '@/components/dashboard/patient/patient-data-grid'
import { Container } from '@mui/material'
import React from 'react'
import CustomizedLayout from '@/components/layout/customized-layout'

const Patient = () => {
  return (
    <Container maxWidth="xl">
    <PatientDataGrid />
    </Container>
  )
}

Patient.getLayout = (page) => (
  <CustomizedLayout>{page}</CustomizedLayout>
)

export default Patient