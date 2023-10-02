import React from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Container } from '@mui/material'

const Phamarcy = () => {
  return (
    <Container maxWidth="xl">Phamarcy</Container>
  )
}

Phamarcy.getLayout = (page) =>(
    <DashboardLayout>{page}</DashboardLayout>
)

export default Phamarcy