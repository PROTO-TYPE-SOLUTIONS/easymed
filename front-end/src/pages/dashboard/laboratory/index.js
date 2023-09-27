import React from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Container } from '@mui/material'
import LaboratoryDataGrid from '@/components/dashboard/laboratory/laboratory-datagrid'

const Laboratory = () => {
  return (
    <Container maxWidth="xl">
      <h1 className='uppercase text-2xl font-semibold my-4'>Results</h1>
      <LaboratoryDataGrid />
    </Container>
  )
}

Laboratory.getLayout = (page) =>(
    <DashboardLayout>{page}</DashboardLayout>
)

export default Laboratory