import React from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'

const Laboratory = () => {
  return (
    <div>Laboratory</div>
  )
}

Laboratory.getLayout = (page) =>(
    <DashboardLayout>{page}</DashboardLayout>
)

export default Laboratory