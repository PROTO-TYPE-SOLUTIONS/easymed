import React from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Container } from '@mui/material'

const Laboratory = () => {
  return (
    <Container maxWidth="xl">
      <h1>Laboratory</h1>
    </Container>
  )
}

Laboratory.getLayout = (page) =>(
    <DashboardLayout>{page}</DashboardLayout>
)

export default Laboratory