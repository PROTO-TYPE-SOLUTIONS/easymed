import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Selection,
  HeaderFilter, Scrolling,
 } from "devextreme-react/data-grid";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { LuMoreHorizontal } from "react-icons/lu";
import CreateAppointmentModal from "./create-appointment-modal";
import { FaWheelchair } from "react-icons/fa";
import AssignDoctorModal from "./assign-doctor-modal";
import Link from "next/link";
import AddPatientModal from "../patient/add-patient-modal";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const allowedPageSizes = [5, 10, 'all'];

const getActions = () => {
  let actions = [
    {
      action: "assign",
      label: "Assign Doctor",
      icon: <FaWheelchair className="text-success text-xl mx-2" />,
    },
  ];

  return actions;
};

const PatientAppointmentDataGrid = ({ patientAppointments }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRowData, setSelectedRowData] = useState({});
  const userActions = getActions();
  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);

  const users = [
    {
      id_number: "1234821",
      name: "Marcos Ochieng",
      country: "Kenya",
      progress: "In Progress",
      gender: "Male",
      age: "34",
      status: "Active",
    },
    {
      id_number: "70081234",
      name: "Derrick Kimani",
      progress: "Progress",
      country: "Uganda",
      gender: "Male",
      age: "23",
      status: "Active",
    },
    {
      id_number: "1234821",
      name: "Jane Munyua",
      progress: "In Progress",
      country: "Tanzania",
      gender: "Female",
      age: "70",
      status: "Active",
    },
    {
      id_number: "70081234",
      name: "Ann Kibet",
      progress: "Progress",
      country: "Burundi",
      gender: "Male",
      age: "49",
      status: "Active",
    },
    {
      id_number: "1234221",
      name: "Ann Ochieng",
      progress: "In Progress",
      country: "Rwanda",
      gender: "Female",
      age: "88",
      status: "Active",
    },
  ];

  //   filter users based on search query
  const filteredUser = users.filter((user) => {
    return user.name.toLocaleLowerCase().includes(searchQuery.toLowerCase());
  });

  const onMenuClick = async (menu, data) => {
    if (menu.action === "create") {
      setSelectedRowData(data);
      setOpen(true);
    } else if (menu.action === "assign") {
      setSelectedRowData(data);
      setAssignOpen(true);
    }
  };

  const actionsFunc = ({ data }) => {
    return (
      <>
        <CmtDropdownMenu
          sx={{ cursor: "pointer" }}
          items={userActions}
          onItemClick={(menu) => onMenuClick(menu, data)}
          TriggerComponent={
            <LuMoreHorizontal className="cursor-pointer text-xl" />
          }
        />
      </>
    );
  };

  const appointmentDateFunc = ({ data }) => {
    const formattedate = new Date(
      data?.appointment_date_time
    ).toLocaleDateString();
    return <p>{formattedate}</p>;
  };

  const dateCreatedFunc = ({ data }) => {
    const formattedate = new Date(data?.date_created).toLocaleDateString();
    return <p>{formattedate}</p>;
  };

  

  return (
    <>
      <section className="flex items-center justify-between mb-2">
        <div className="">
          <h1 className="text-xl text-primary">
            Patient Appointments
          </h1>
        </div>
        <div className="flex gap-4">
        < AddPatientModal />
          <Link href="/dashboard/reception-interface/booked-appointments" className="bg-primary text-white rounded-xl px-3 py-2 text-sm">
            Booked Appointments
          </Link>
          {/* <input
            className="shadow-2xl border-gray py-2 px-8 focus:outline-none rounded"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            placeholder="Search..."
          /> */}
        </div>
      </section>
      <DataGrid
        dataSource={patientAppointments}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
        remoteOperations={true}
        showColumnLines={true}
        showRowLines={true}
        wordWrapEnabled={true}
        allowPaging={true}
        className="shadow-xl w-full"
        // height={"70vh"}
      >
        <Scrolling rowRenderingMode='virtual'></Scrolling>
        <Paging defaultPageSize={5} />
        <Pager
          visible={true}
          allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={showPageSizeSelector}
          showInfo={showInfo}
          showNavigationButtons={showNavButtons}
        />
        <HeaderFilter visible={true} />
        <Column
          dataField="gender"
          caption="Action"
          width={100}
          allowFiltering={false}
          alignment="center"
          cellRender={actionsFunc}
        />
        <Column
          dataField="first_name"
          caption="First Name"
          width={140}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column
          dataField="second_name"
          caption="Last Name"
          width={140}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column
          dataField="appointment_date_time"
          caption="Date of Appointment"
          width={200}
          cellRender={appointmentDateFunc}
        />
        <Column
          dataField="date_created"
          caption="Date Created"
          width={140}
          cellRender={dateCreatedFunc}
        />
        {/* <Column dataField="age" caption="Age" width={140} />
        <Column dataField="gender" caption="Gender" width={100} /> */}
        <Column dataField="status" caption="Status" width={140} />
      </DataGrid>
      <CreateAppointmentModal {...{ open, setOpen, selectedRowData }} />
      <AssignDoctorModal {...{ assignOpen, setAssignOpen, selectedRowData }} />
    </>
  );
};

export default PatientAppointmentDataGrid;
