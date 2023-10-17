import React from "react";
import { Container, Grid } from "@mui/material";
import PatientsDataGrid from "@/components/dashboard/patient/patient-data-grid";
import { AiOutlineRight } from "react-icons/ai";
import { adminData } from "@/assets/menu";
import DashboardLayout from "@/components/layout/dashboard-layout";

const Dashboard = () => {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={1} className="my-8">
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
      </Grid>
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
