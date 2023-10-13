import React from 'react'
import CustomizedLayout from '@/components/layout/customized-layout'
import { Container } from '@mui/material'

const ReceptionInterface = () => {
  return (
    <Container maxWidth="xl" className="mt-4">
        <h1 className='text-2xl'>Receptionist Admin Panel</h1>
    </Container>
  )
}

ReceptionInterface.getLayout = (page)=>(
    <CustomizedLayout>{page}</CustomizedLayout>
)

export default ReceptionInterface