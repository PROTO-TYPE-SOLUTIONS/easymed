import React from 'react'
import CustomizedLayout from '@/components/layout/customized-layout'

const Admin = () => {
  return (
    <div>Admin</div>
  )
}

Admin.getLayout = (page)=>(
    <CustomizedLayout>{page}</CustomizedLayout>
)

export default Admin