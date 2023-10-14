import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Selection } from "devextreme-react/data-grid";
import AddPatientModal from "../patient/add-patient-modal";
import AssignDoctorModal from './assign-doctor-modal'

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const ReceptionPatientsDataGrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRecords, setSelectedRecords] = useState([]);

  const users = [
    {
      id_number: "1234821",
      name: "Marcos Ochieng",
      country: "Kenya",
      gender: "Male",
      age: "34",
      status: "Active",
    },
    {
      id_number: "70081234",
      name: "Derrick Kimani",
      country: "Uganda",
      gender: "Male",
      age: "23",
      status: "Active",
    },
    {
      id_number: "1234821",
      name: "Jane Munyua",
      country: "Tanzania",
      gender: "Female",
      age: "70",
      status: "Active",
    },
    {
      id_number: "70081234",
      name: "Ann Kibet",
      country: "Burundi",
      gender: "Male",
      age: "49",
      status: "Active",
    },
    {
      id_number: "1234221",
      name: "Ann Ochieng",
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

  const onSelectionChanged = (props) => {
    const { selectedRowKeys, selectedRowsData } = props;
    setSelectedRecords(selectedRowKeys);
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <AddPatientModal />
        </div>
        <div className="flex items-center gap-2">
          {selectedRecords.length > 0 && <AssignDoctorModal {...{selectedRecords}} /> }
          <input
            className="rounded shadow-xl py-3 px-2 focus:outline-none mb-2"
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
        className="shadow-xl"
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
          width={200}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column dataField="age" caption="Age" width={140} />
        <Column dataField="country" caption="Country" width={200} />
        <Column dataField="gender" caption="Gender" width={200} />
        <Column dataField="country" caption="Other" width={200} />
      </DataGrid>
    </section>
  );
};

export default ReceptionPatientsDataGrid;
