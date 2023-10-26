import React from "react";
import { Container } from "@mui/material";
import PatientsDataGrid from "@/components/dashboard/patient/patient-data-grid";
import DashboardLayout from "@/components/layout/dashboard-layout";
import DashboardCards from "@/components/dashboard/dashboard-cards";


const Dashboard = () => {
  return (
    <Container maxWidth="xl">
      <DashboardCards />
          <PatientsDataGrid />
      {/* <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
        </Grid>
        <Grid item md={4} xs={12} className="space-y-4">
          <Doctors />
        </Grid>
      </Grid> */}
      {/* <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <CalenderDate />
        </Grid>
        <Grid item md={4} xs={12} className="space-y-4">
          <BookedSessions />
        </Grid>
      </Grid> */}
    </Container>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
