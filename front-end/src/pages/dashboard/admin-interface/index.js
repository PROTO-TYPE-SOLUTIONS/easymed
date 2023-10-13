import React,{useState} from "react";
import CustomizedLayout from "@/components/layout/customized-layout";
import { Container, Grid } from "@mui/material";
import { adminData } from "@/assets/menu";
import { AiOutlineRight } from "react-icons/ai";
import AdminUsersDataGrid from "@/components/dashboard/admin-interface/users-datagrid";
import AdminPatientsDataGrid from "@/components/dashboard/admin-interface/patients-datagrid";
import AdminDoctorsDataGrid from "@/components/dashboard/admin-interface/doctors-datagrid";

const Admin = () => {
  const [currentTab,setCurrentTab] = useState(0);
  return (
    <Container maxWidth="xl" className="py-6">
      <Grid container spacing={2}>
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
      <section className="mt-8">
        <div className="flex items-center gap-4">
        <div>
          <h1 className={`${currentTab === 0 ? 'bg-primary cursor-pointer text-white' : 'bg-white cursor-pointer'} rounded-3xl shadow-2xl py-1 sm:px-8 px-4`} onClick={() => setCurrentTab(0)}>Users</h1>
        </div>
        <div>
          <h1 className={`${currentTab === 1 ? 'bg-primary text-white cursor-pointer' : 'bg-white cursor-pointer'} rounded-3xl shadow-2xl py-1 sm:px-8 px-4`} onClick={() => setCurrentTab(1)}>Patients</h1>
        </div>
        <div>
          <h1 className={`${currentTab === 2 ? 'bg-primary text-white cursor-pointer' : 'bg-white cursor-pointer'} rounded-3xl shadow-2xl py-1 sm:px-8 px-4`} onClick={() => setCurrentTab(2)}>Doctors</h1>
        </div>
        </div>
        <div className="">
             {currentTab === 0 && <AdminUsersDataGrid /> }
             {currentTab === 1 && <AdminPatientsDataGrid /> }
             {currentTab === 2 && <AdminDoctorsDataGrid /> }
        </div>
      </section>
    </Container>
  );
};

Admin.getLayout = (page) => <CustomizedLayout>{page}</CustomizedLayout>;

export default Admin;
