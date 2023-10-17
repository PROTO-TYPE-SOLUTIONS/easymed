import React from 'react'
import CustomizedLayout from '@/components/layout/customized-layout'
import { Container } from '@mui/material'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import Link from 'next/link'
import BookedAppointmentsDataGrid from '@/components/dashboard/reception-interface/booked-appointments-datagrid';


const ReceptionPatients = () => {
  return (
    <Container maxWidth="xl" className="mt-8">
        <Link href="/dashboard/reception-interface" className="flex items-center gap-2">
          <MdOutlineKeyboardBackspace className='text-2xl text-primary' />
          <p className='font-bold text-primary'>Back</p>
        </Link>
        <BookedAppointmentsDataGrid />
    </Container>
  )
}

ReceptionPatients.getLayout = (page)=>(
    <CustomizedLayout>{page}</CustomizedLayout>
)

export default ReceptionPatients