import React, { useState } from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import { Container } from "@mui/material";
import AdminUsersDataGrid from "@/components/dashboard/admin-interface/users-datagrid";
import AdminPatientsDataGrid from "@/components/dashboard/admin-interface/patients-datagrid";
import AdminDoctorsDataGrid from "@/components/dashboard/admin-interface/doctors-datagrid";
import AuthGuard from "@/assets/hoc/auth-guard";
import ProtectedRoute from "@/assets/hoc/protected-route";

const Admin = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Container maxWidth="xl" className="py-2">
      <section className="mb-2">
        <div className="w-full py-1 px-2 flex items-center gap-4 text-center">
          <div>
            <p
              className={`${
                currentTab === 0
                  ? "cursor-pointer text-primary p-4 border-b-2 border-primary text-center"
                  : "cursor-pointer text-center p-4"
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
                  ? "cursor-pointer text-primary p-4 border-b-2 border-primary text-center"
                  : "cursor-pointer text-center p-4"
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
                  ? "cursor-pointer text-primary p-4 border-b-2 border-primary text-center"
                  : "cursor-pointer text-center p-4"
              } `}
              onClick={() => setCurrentTab(2)}
            >
              Doctors
            </p>
          </div>
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
