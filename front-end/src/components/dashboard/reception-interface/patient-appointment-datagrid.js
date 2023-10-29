import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Selection } from "devextreme-react/data-grid";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { LuMoreHorizontal } from "react-icons/lu";
import CreateAppointmentModal from "./create-appointment-modal";
import { FaWheelchair } from "react-icons/fa";
import AssignDoctorModal from "./assign-doctor-modal";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const getActions = () => {
  let actions = [
    {
      action: "create",
      label: "Convert to Patient",
      icon: <FaWheelchair className="text-success text-xl mx-2" />,
    },
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
    const formattedate = new Date(data?.appointment_date_time).toLocaleDateString()
    return <p>{formattedate}</p>
  }

  const dateCreatedFunc = ({ data }) => {
    const formattedate = new Date(data?.date_created).toLocaleDateString()
    return <p>{formattedate}</p>
  }

  return (
    <section>
      <div className="flex items-center justify-end">
        <input
          className="shadow-2xl py-3 px-8 focus:outline-none mb-2 w-1/2 rounded-3xl"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          placeholder="Search..."
        />
      </div>
      <div className="mb-2">
        <h1 className="text-xl text-primary uppercase">
          Patient Appointments
        </h1>
      </div>
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
        height={"70vh"}
      >
        <Pager
          visible={true}
          // allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={true}
          showNavigationButtons={true}
        />
        <Column
          dataField="gender"
          caption="Action"
          width={100}
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
        <Column dataField="appointment_date_time" caption="Date of Appointment" width={140} cellRender={appointmentDateFunc} />
        <Column dataField="date_created" caption="Date Created" width={140} cellRender={dateCreatedFunc} />
        {/* <Column dataField="date_of_birth" caption="Date of Birth" width={140} /> */}
        {/* <Column dataField="reason" caption="Reason" width={280} /> */}
        <Column dataField="assigned_doctor" caption="Assigned Doctor" width={200} />
        {/* <Column dataField="gender" caption="Gender" width={100} /> */}
        <Column dataField="status" caption="Status" width={140} />
        
      </DataGrid>
      <CreateAppointmentModal {...{ open, setOpen, selectedRowData }} />
      <AssignDoctorModal {...{ assignOpen, setAssignOpen, selectedRowData }} />
    </section>
  );
};

export default PatientAppointmentDataGrid;
