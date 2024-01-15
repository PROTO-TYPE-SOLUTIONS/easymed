import React, {useState, useEffect} from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Container, Grid, Paper } from "@mui/material";
import AuthGuard from "@/assets/hoc/auth-guard";
import PharmacyDataGrid from "@/components/dashboard/pharmacy";
import { pharmacyDisplayStats } from "@/assets/menu";


const Phamarcy = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const columnStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding:10,
    textAlign: 'center',
    color: 'black',
    background: 'white',
    borderRadius: 10,
    height: '75px',
    gap: '20px',
  };

  const displayInformation = pharmacyDisplayStats.map((item, index)=>{
    return(
      <Grid key={`pharmacy-display-info ${index}`} item xs={4}>
        <Paper style={columnStyle}>
          <img className="h-8 w-8" src={item.icon} alt=""></img>
          <div className="">
            <p>{item.label}</p>
            <p>{item.figures}</p>
          </div>
        </Paper>
      </Grid>
      )
  })

  return (
    <Container maxWidth="xl">
      <div className="flex items-center gap-4 my-8">
        <button onClick={()=> setCurrentTab(0)} className={`${currentTab === 0 ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
          New Invoice
        </button>
        {/* <RequisitionModal /> */}
        <Link href='/dashboard/inventory/requisitions'>
          Create Requisition
        </Link>
      </div>
      <Grid container spacing={2}>
        {displayInformation}      
      </Grid>
      <h3 className="text-2xl mt-12"> Prescriptions </h3>
      <PharmacyDataGrid />

    </Container>
  );

};

Phamarcy.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default Phamarcy;

