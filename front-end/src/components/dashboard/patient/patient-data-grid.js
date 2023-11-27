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


  useEffect(() =>{
    dispatch(getAllPatients());
  },[])

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-2">
        <AddPatientModal />
        {/* <input
          className="shadow py-3 px-2 focus:outline-none"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          placeholder="Search..."
        /> */}
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
        <Column dataField="date_of_birth" caption="Age" width={140} />
        <Column dataField="gender" caption="Gender" width={140} />
        <Column dataField="insurance" caption="Insurance" width={140} />
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
