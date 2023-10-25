import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager } from "devextreme-react/data-grid";
import AddPatientModal from "./add-patient-modal";
import { Chip } from "@mui/material";
import { getAllPatients } from "@/redux/features/patients";
import { useSelector,useDispatch } from "react-redux";


const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

  
const PatientsDataGrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { patients } = useSelector((store) => store.patient);
  const dispatch = useDispatch();
  console.log("PATIENTS ",patients)

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


  const statusFunc = ({ data }) => {
    if (data?.progress_status === "In Treatment") {
      return (
        <Chip variant="contained" size="small" className="bg-primary text-white" label={data.progress_status} />
      );
    } else if (data?.progress_status === "Discharged") {
      return (
        <Chip variant="contained" size="small" className="bg-success text-white" label={data.progress_status} />
      );
    } else if (data?.progress_status === "New Patient") {
      return (
        <Chip variant="contained" size="small" className="bg-card text-white" label={data.progress_status} />
      );
    }
  };

  //   filter users based on search query
  const filteredUser = users.filter((user) => {
    return user.name.toLocaleLowerCase().includes(searchQuery.toLowerCase());
  });


  useEffect(() =>{
    dispatch(getAllPatients());
  },[])

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-2">
        <AddPatientModal />
        <input
          className="shadow py-3 px-2 focus:outline-none"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          placeholder="Search..."
        />
      </div>
      <DataGrid
        dataSource={patients}
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
          dataField="first_name"
          caption="First Name"
          width={200}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column
          dataField="second_name"
          caption="Last Name"
          width={200}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column dataField="date_of_birth" caption="Date of Birth" width={140} />
        <Column dataField="insurance" caption="Insurance" width={140} />
        <Column dataField="gender" caption="Gender" width={140} />
        <Column
          dataField="insurance"
          caption="Insurance"
          width={200}
        />
        <Column
          dataField=""
          caption="Status"
          width={140}
          cellRender={statusFunc}
        />
      </DataGrid>
    </section>
  );
};

export default PatientsDataGrid;
