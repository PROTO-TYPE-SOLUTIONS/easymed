import React, { useState } from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import { Container } from "@mui/material";
import AdminUsersDataGrid from "@/components/dashboard/admin-interface/users-datagrid";
import AdminPatientsDataGrid from "@/components/dashboard/admin-interface/patients-datagrid";
import AdminDoctorsDataGrid from "@/components/dashboard/admin-interface/doctors-datagrid";
import AddPatientModal from "@/components/dashboard/patient/add-patient-modal";
import AdminCreateUserModal from "@/components/dashboard/admin-interface/admin-add-user-modal";
import AdminCreateDoctor from "@/components/dashboard/admin-interface/admin-add-doctor";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import AuthGuard from "@/assets/hoc/auth-guard";

const Admin = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Container maxWidth="xl" className="py-6">
      <DashboardCards />
      {/* <Grid container spacing={2}>
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
      </Grid> */}
      <section className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-8 uppercase border-b border-primary text-primary text-center">
          <div>
            <p
              className={`${
                currentTab === 0
                  ? "cursor-pointer border-b-2 py-1 border-primary font-bold"
                  : "cursor-pointer font-bold"
              } `}
              onClick={() => setCurrentTab(0)}
            >
              Users
            </p>
          </div>
          <div>
            <p
              className={`${
                currentTab === 1
                  ? "cursor-pointer border-b-2 py-1 border-primary font-bold"
                  : "cursor-pointer font-bold"
              }`}
              onClick={() => setCurrentTab(1)}
            >
              Patients
            </p>
          </div>
          <div>
            <p
              className={`${
                currentTab === 2
                  ? "cursor-pointer border-b-2 py-1 border-primary font-bold"
                  : "cursor-pointer font-bold"
              }`}
              onClick={() => setCurrentTab(2)}
            >
              Doctors
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AddPatientModal />
          <AdminCreateUserModal />
          <AdminCreateDoctor />
        </div>
      </section>
      <div className="mt-8">
        {currentTab === 0 && <AdminUsersDataGrid />}
        {currentTab === 1 && <AdminPatientsDataGrid />}
        {currentTab === 2 && <AdminDoctorsDataGrid />}
      </div>
    </Container>
  );
};

Admin.getLayout = (page) => (
  <AuthGuard>
    <CustomizedLayout>{page}</CustomizedLayout>
  </AuthGuard>
);

export default Admin;
