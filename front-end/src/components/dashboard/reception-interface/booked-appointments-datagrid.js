import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Selection } from "devextreme-react/data-grid";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { LuMoreHorizontal } from "react-icons/lu";
import CreateAppointmentModal from "./create-appointment-modal";
import { AiFillDelete } from 'react-icons/ai';

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const getActions = () => {
  let actions = [
    {
      action: "create",
      label: "Create",
      icon: <AiFillDelete className="text-warning text-xl mx-2" />,
    },
  ];

  return actions;
};

const BookedAppointmentsDataGrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRowData, setSelectedRowData] = useState({});
  const userActions = getActions();
  const [open, setOpen] = useState(false);

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
    } else if (menu.action === "edit") {
      // setSelectedRowData(data);
      // setOpen(true);
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

  return (
    <section>
      <div className="flex items-center gap-2 justify-between">
        <h1 className="text-xl font-semibold text-primary uppercase">Booked Appointments</h1>
        <div className="flex items-center gap-2">
          <input
            className="shadow-xl py-3 px-2 focus:outline-none mb-2"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            placeholder="Search..."
          />
        </div>
      </div>
      <DataGrid
        dataSource={filteredUser}
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
        <Column dataField="id_number" caption="ID" width={140} />
        <Column
          dataField="name"
          caption="Name"
          width={240}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column dataField="age" caption="Age" width={140} />
        <Column dataField="country" caption="Country" width={200} />
        <Column dataField="gender" caption="Gender" width={200} />
        <Column dataField="gender" caption="Action" width={200} cellRender={actionsFunc} />
      </DataGrid>
      <CreateAppointmentModal {...{open,setOpen,selectedRowData}} />
    </section>
  );
};

export default BookedAppointmentsDataGrid;
