import React from 'react'
import ReferralLayout from '@/components/layout/referral-layout'
import { Container } from '@mui/material'

const Referrals = () => {
  return (
    <Container maxWidth="xl">
      <h1>Referrals</h1>
    </Container>
  )
}


Referrals.getLayout = (page)=>(
    <ReferralLayout>{page}</ReferralLayout>
)

export default Referrals