import React from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Container } from '@mui/material'

const Schedule = () => {
  return (
    <Container maxWidth="xl">Schedule</Container>
  )
}

Schedule.getLayout = (page) =>(
    <DashboardLayout>{page}</DashboardLayout>
)
export default Schedule