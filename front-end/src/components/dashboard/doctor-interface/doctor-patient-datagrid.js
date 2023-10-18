import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Selection } from "devextreme-react/data-grid";
import AssignDoctorModal from "../reception-interface/assign-doctor-modal";
import { Chip } from "@mui/material";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const DoctorPatientDataGrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [open, setOpen] = useState(false);

  const users = [
    {
      id_number: "1234821",
      name: "Marcos Ochieng",
      assigned_doctor: "Dr. Patrick",
      progress_status: "Discharged",
      gender: "Male",
      age: "34",
      status: "Active",
    },
    {
      id_number: "70081234",
      name: "Derrick Kimani",
      progress_status: "In Treatment",
      assigned_doctor: "Dr. Moses",
      gender: "Male",
      age: "23",
      status: "Active",
    },
    {
      id_number: "1234821",
      name: "Jane Munyua",
      progress_status: "New Patient",
      assigned_doctor: "Dr. Melanie",
      gender: "Female",
      age: "70",
      status: "Active",
    },
    {
      id_number: "70081234",
      name: "Ann Kibet",
      progress_status: "Discharged",
      assigned_doctor: "Dr. Brenda",
      gender: "Male",
      age: "49",
      status: "Active",
    },
    {
      id_number: "1234221",
      name: "Ann Ochieng",
      progress_status: "In Treatment",
      assigned_doctor: "Dr. Patrick",
      gender: "Female",
      age: "88",
      status: "Active",
    },
  ];

  //   filter users based on search query
  const filteredUser = users.filter((user) => {
    return user.name.toLocaleLowerCase().includes(searchQuery.toLowerCase());
  });

  const onSelectionChanged = (props) => {
    const { selectedRowKeys, selectedRowsData } = props;
    setSelectedRecords(selectedRowKeys);
  };

  const statusFunc = ({ data }) => {
    if (data?.progress_status === "In Treatment") {
      return (
        <Chip variant="contained" size="small" label={data.progress_status} className="bg-primary text-white" />
      );
    } else if (data?.progress_status === "Discharged") {
      return (
        <Chip variant="contained" size="small" label={data.progress_status} className="bg-success text-white" />
      );
    } else if (data?.progress_status === "New Patient") {
      return (
        <Chip variant="contained" size="small" label={data.progress_status} className="bg-card text-white" />
      );
    }
  };

  return (
    <section>
      <div className="flex items-center gap-2 justify-end">
        <div className="flex items-center gap-2">
          {selectedRecords.length > 0 && (
            <AssignDoctorModal {...{ selectedRecords }} />
          )}
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
        onSelectionChanged={onSelectionChanged}
        selectedRowKeys={selectedRecords}
        showBorders={true}
        remoteOperations={true}
        showColumnLines={true}
        showRowLines={true}
        wordWrapEnabled={true}
        allowPaging={true}
        className="shadow-xl w-full"
        height={"70vh"}
      >
        <Selection
          mode="multiple"
          selectAllMode={"allMode"}
          //showCheckBoxesMode={checkBoxesMode}
        />
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
        <Column
          dataField="gender"
          caption="Status"
          width={140}
          cellRender={statusFunc}
        />
        <Column
          dataField="assigned_doctor"
          caption="Assigned Doctor"
          width={200}
        />
        <Column dataField="gender" caption="Gender" width={140} />
      </DataGrid>
    </section>
  );
};

export default DoctorPatientDataGrid;
