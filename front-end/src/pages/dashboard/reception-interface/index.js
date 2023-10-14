import React from 'react'
import CustomizedLayout from '@/components/layout/customized-layout'
import { Container,Grid } from '@mui/material'
import ReceptionPatientsDataGrid from '@/components/dashboard/reception-interface/reception-patient-datagrid'
import { adminData } from '@/assets/menu'
import { AiOutlineRight } from "react-icons/ai";


const ReceptionInterface = () => {
  return (
    <Container maxWidth="xl" className="mt-8">
      <Grid container spacing={2} className="mb-8">
        {adminData.map((data, index) => (
          <Grid key={index} item md={4} xs={12}>
            <section
              className={`${
                index === 1
                  ? "bg-white shadow-xl"
                  : "bg-card shadow-xl text-white "
              } rounded h-[20vh]`}
            >
              <div className="p-2 h-[14vh] space-y-4">
                <p className="text-sm">{data.label}</p>
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-xl">{data.number}</h1>
                  <div className="flex items-center">
                    <p className="text-xs font-thin underline">
                      {data?.waiting} {data?.status}
                    </p>
                    <AiOutlineRight />
                  </div>
                </div>
              </div>
              <div
                className={`${
                  index === 1 ? "bg-background" : "bg-cardSecondary "
                } rounded-br rounded-bl h-[6vh] p-2 flex items-center justify-between text-xs font-thin`}
              >
                <p>{data.condition}</p>
                <p>{data.condition_number}</p>
              </div>
            </section>
          </Grid>
        ))}
      </Grid>
        <ReceptionPatientsDataGrid />
    </Container>
  )
}

ReceptionInterface.getLayout = (page)=>(
    <CustomizedLayout>{page}</CustomizedLayout>
)

export default ReceptionInterface