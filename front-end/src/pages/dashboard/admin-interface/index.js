import React, { useState } from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import { Container } from "@mui/material";
import AdminUsersDataGrid from "@/components/dashboard/admin-interface/users-datagrid";
import AdminPatientsDataGrid from "@/components/dashboard/admin-interface/patients-datagrid";
import AdminDoctorsDataGrid from "@/components/dashboard/admin-interface/doctors-datagrid";
import AddPatientModal from "@/components/dashboard/patient/add-patient-modal";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import AuthGuard from "@/assets/hoc/auth-guard";
import ProtectedRoute from "@/assets/hoc/protected-route";
import AdminCreateUser from "@/components/dashboard/admin-interface/admin-create-user";

const Admin = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Container maxWidth="xl" className="py-6">
      <DashboardCards />
      <section className="flex items-center justify-between mt-4 mb-2">
        <div className="bg-white shadow-xl rounded-3xl py-1 px-2 flex items-center gap-4 text-primary text-center text-xs">
          <div>
            <p
              className={`${
                currentTab === 0
                  ? "cursor-pointer bg-primary rounded-3xl p-2 text-white text-center"
                  : "cursor-pointer text-center"
              }`}
              onClick={() => setCurrentTab(0)}
            >
              Users
            </p>
          </div>
          <div>
            <p
              className={`${
                currentTab === 1
                  ? "cursor-pointer bg-primary text-center rounded-3xl p-2 text-white"
                  : "cursor-pointer text-center"
              } `}
              onClick={() => setCurrentTab(1)}
            >
              Patients
            </p>
          </div>
          <div>
            <p
              className={`${
                currentTab === 2
                  ? "cursor-pointer bg-primary text-center rounded-3xl p-2 text-white"
                  : "cursor-pointer text-center"
              } `}
              onClick={() => setCurrentTab(2)}
            >
              Doctors
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AddPatientModal />
          <AdminCreateUser />
        </div>
      </section>
      <div className="mt-2">
        {currentTab === 0 && <AdminUsersDataGrid />}
        {currentTab === 1 && <AdminPatientsDataGrid />}
        {currentTab === 2 && <AdminDoctorsDataGrid />}
      </div>
    </Container>
  );
};
Admin.getLayout = (page) => (
  <ProtectedRoute permission={'CAN_ACCESS_ADMIN_DASHBOARD'}>
    <AuthGuard>
      <CustomizedLayout>{page}</CustomizedLayout>
    </AuthGuard> 
  </ProtectedRoute> 
);

export default Admin;
