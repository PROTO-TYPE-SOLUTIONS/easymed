import React from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'

const Dashboard = () => {
  return (
    <div>Dashboard</div>
  )
}


Dashboard.getLayout = (page) =>(
    <DashboardLayout>{page}</DashboardLayout>
)

export default Dashboard