import React from 'react'
import { Container } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AuthGuard from '@/assets/hoc/auth-guard';
import CreateRequisition from '@/components/dashboard/inventory/CreateRequisition';
import DashboardLayout from '@/components/layout/dashboard-layout';
import PhamarcyNav from '@/components/dashboard/pharmacy/PhamarcyNav';

const PharmacyRequisition = () => {
    const router = useRouter();
    const pathName = router.pathname
  return (
    <Container maxWidth="xl">
        <PhamarcyNav/>
        <CreateRequisition />
    </Container>
  )
}

PharmacyRequisition.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>{page}</DashboardLayout>;
    </AuthGuard>
);

export default PharmacyRequisition;