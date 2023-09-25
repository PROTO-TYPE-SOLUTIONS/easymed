import React from "react";
import { FaWheelchair } from "react-icons/fa";
import { FaClockRotateLeft, FaCodePullRequest } from "react-icons/fa6";
import { Container, Grid } from "@mui/material";
import DashboardLayout from "@/components/layout/dashboard-layout";
import PatientsDataGrid from "@/components/patient/patient-data-grid";
import { dashboardData } from "@/assets/menu";

const Dashboard = () => {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={1} className="my-8">
        {dashboardData.map((data, index) => (
          <Grid item md={4} xs={12}>
            <section className="border-2 border-gray-300 rounded-xl px-4 py-3 h-20 flex items-center justify-center gap-4">
              <div>
                {data?.icon}
              </div>
              <div className="text-center text-sm">
                <p>{data?.label}</p>
                <p className="text-[#02273D]">{data?.number}</p>
              </div>
            </section>
          </Grid>
        ))}
      </Grid>
      <PatientsDataGrid />
    </Container>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
