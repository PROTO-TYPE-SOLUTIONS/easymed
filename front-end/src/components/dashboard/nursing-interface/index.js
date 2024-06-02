import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager,
  HeaderFilter, Scrolling,
 } from "devextreme-react/data-grid";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { LuMoreHorizontal } from "react-icons/lu";
import { MdAddCircle } from "react-icons/md";
import { Chip } from "@mui/material";
import { getAllPatients, getAllProcesses } from "@/redux/features/patients";
import { useSelector,useDispatch } from "react-redux";
import AddTriageModal from './add-triage-modal';
import { getAllDoctors } from "@/redux/features/doctors";
import { useAuth } from "@/assets/hooks/use-auth";


const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const allowedPageSizes = [5, 10, 'all'];

const getActions = () => {
  let actions = [
    {
      action: "add",
      label: "Add Triage",
      icon: <MdAddCircle className="text-success text-xl mx-2" />,
    },
  ];

  return actions;
};

const NursePatientDataGrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const userActions = getActions();
  const [open, setOpen] = React.useState(false);
  const [triageOpen, setTriageOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState({});
  const dispatch = useDispatch();
  const { patients, processes } = useSelector((store) => store.patient);
  const { doctors } = useSelector((store)=> store.doctor)
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);
  const auth = useAuth()


  useEffect(() =>{
    if(auth){
      dispatch(getAllPatients());
      dispatch(getAllProcesses())
      dispatch(getAllDoctors(auth))
    }
  },[]);


  const onMenuClick = async (menu, data) => {
    if (menu.action === "add") {
      setSelectedRowData(data);
      setTriageOpen(true);
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

  // filter users based on search query
  const filteredProcesses = processes.filter((process) => process.track === "triage");

  console.log("FILTERED PROCESSES TRIAGE", filteredProcesses)

  const patientNameRender = (cellData) => {
    const patient = patients.find((patient) => patient.id === cellData.data.patient);
    return patient ? `${patient.first_name} ${patient.second_name}` : ""
  }

  const doctorNameRender = (cellData) => {
    const doctor = doctors.find((doctor) => doctor.id === cellData.data.doctor);
    return doctor ? `${doctor.first_name} ${doctor.last_name}` : ""
  }

  return (
    <section>
      <DataGrid
        dataSource={filteredProcesses}
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
        <Paging defaultPageSize={10} />
        <Pager
          visible={true}
          allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={showPageSizeSelector}
          showInfo={showInfo}
          showNavigationButtons={showNavButtons}
        />
        <HeaderFilter visible={true} />
        <Column
          dataField="track_number"
          caption="Process Id"
          width={320}
        />
        <Column
          dataField="patient"
          caption="Patient Name"
          width={140}
          allowFiltering={true}
          allowSearch={true}
          cellRender={patientNameRender}
        />
        <Column
          dataField="doctor"
          caption="Assigned Doctor"
          width={120}
          allowFiltering={true}
          allowSearch={true}
          cellRender={doctorNameRender}
        />
        <Column
          dataField=""
          caption="Action"
          width={140}
          cellRender={actionsFunc}
        />
      </DataGrid>
      {triageOpen && <AddTriageModal {...{ triageOpen,setTriageOpen,selectedRowData}} />}
    </section>
  );
};

export default NursePatientDataGrid;

