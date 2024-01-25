import React from 'react'
import { Container, Grid, Item } from '@mui/material';

import AuthGuard from '@/assets/hoc/auth-guard';
import CustomizedLayout from '@/components/layout/customized-layout';
import AccountNav from '@/components/account/AccountNav';
import AccountMain from '@/components/account/AccountProfile';

const MyAccount = () => {
  return (
    <Container maxWidth="xl">
        <h2>My Account</h2>
        <Grid container className='p-4'>
            <Grid className='bg-warning flex justify-center' item xs={3}>
                <AccountNav/>
            </Grid>
            <Grid className='bg-success flex justify-center items-center' item xs={9}>
                <AccountMain/>
            </Grid>
        </Grid>
    </Container>
  )
}

MyAccount.getLayout = (page) => (
    <AuthGuard>
      <CustomizedLayout>{page}</CustomizedLayout>;
    </AuthGuard>
);

export default MyAccount;