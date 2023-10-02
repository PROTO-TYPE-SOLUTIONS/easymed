import React from 'react'
import CustomizedLayout from '@/components/layout/customized-layout'
import { Container } from '@mui/material'

const Messages = () => {
  return (
    <Container maxWidth="xl">Messages</Container>
  )
}


Messages.getLayout = (page) => (
  <CustomizedLayout>{page}</CustomizedLayout>
)
export default Messages