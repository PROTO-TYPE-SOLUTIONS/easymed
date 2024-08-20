import React, { useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Scrolling,
 } from "devextreme-react/data-grid";
import { labData, months } from "@/assets/dummy-data/laboratory";
import { Grid } from "@mui/material";
import { LuMoreHorizontal } from "react-icons/lu";
import { AiOutlineDownload } from 'react-icons/ai';
import CmtDropdownMenu from "@/assets/DropdownMenu";
import EquipmentModal from "./equipment-modal";

import RequestInfoModal from "./RequestInfoModal";
import LabModal from "../doctor-interface/lab-modal";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const allowedPageSizes = [5, 10, 'all'];

const getActions = () => {
  let actions = [
    { action: "add", label: "Add Test", icon: <AiOutlineDownload className="text-card text-xl" /> },
    { action: "view", label: "Request Information", icon: <AiOutlineDownload className="text-card text-xl" /> },
    { action: "sample", label: "Confirm Sample Collection", icon: <AiOutlineDownload className="text-card text-xl" /> },
    { action: "equipment", label: "Send to equipment", icon: <AiOutlineDownload className="text-card text-xl" /> },
  ];
 
  return actions;
};


const LabRequestDataGrid = ( ) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const userActions = getActions();
  const [open,setOpen] = useState(false);
  const [labOpen, setLabOpen] = useState(false);
  const [requestInfoOpen,setRequestInfoOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState({});
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);

  const { processes, patients } = useSelector((store)=> store.patient)

  const labTestsSchedules = processes.filter((process)=> process.track==="lab")

  const patientNameRender = (cellData) => {
    const patient = patients.find((patient) => patient.id === cellData.data.patient);
    return patient ? `${patient.first_name} ${patient.second_name}` : ""
  }

  const onMenuClick = async (menu, data) => {
   if (menu.action === "add") {
      setSelectedRowData(data)
      setLabOpen(true)
    }else if(menu.action === 'equipment'){
      setSelectedRowData(data)
      setOpen(true)
    }else if(menu.action === 'view'){
      setSelectedRowData(data)
      setRequestInfoOpen(true)
    }
  };

  const actionsFunc = ({ data }) => {
    return (
      <>
        <CmtDropdownMenu
        sx={{ cursor: "pointer" }}
        items={userActions}
        onItemClick={(menu) => onMenuClick(menu, data)}
        TriggerComponent={<LuMoreHorizontal className="cursor-pointer text-xl" />}
      />
      </>
    );
  };

  return (
    <>
      <Grid container spacing={2} className="my-2">
        <Grid item md={4} xs={12}>
          <input
            className="py-3 w-full px-4 focus:outline-none placeholder-font font-thin text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            fullWidth
            placeholder="Search lab requests"
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <select
            className="px-4 w-full py-3 focus:outline-none"
            name=""
            id=""
          >
            <option value="" selected>
              Search by Month
            </option>
            {months.map((month, index) => (
              <option key={index} value="">{month.name}</option>
            ))}
          </select>
        </Grid>
        <Grid item md={4} xs={12}>
          <div className="flex">
            <button className="bg-white shadow border-primary py-3 px-4 w-full">
              Date
            </button>
            <button className="bg-white shadow border-primary py-3 px-4 w-full">
              Week
            </button>
            <button className="bg-white shadow border-primary py-3 px-4 w-full">
              Month
            </button>
          </div>
        </Grid>
      </Grid>

      {/* DATAGRID STARTS HERE */}
      <DataGrid
        dataSource={labTestsSchedules}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
        remoteOperations={true}
        showColumnLines={false}
        showRowLines={true}
        wordWrapEnabled={true}
        // allowPaging={true}
        // height={"70vh"}
        className="w-full shadow"
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
        <Column 
          dataField="patient_number" 
          caption="PId" 
          width={120}
        />
        <Column 
          dataField="patient" 
          caption="Patient Name" 
          width={200}
          cellRender={patientNameRender}
        />
        <Column
          dataField=""
          caption=""
          width={50}
          cellRender={actionsFunc}
        />
      </DataGrid>
      {open && <EquipmentModal {...{open,setOpen,selectedRowData}} />}
      {labOpen && (<LabModal {...{ labOpen, setLabOpen, selectedRowData }}/>)}
      {requestInfoOpen && (
        <RequestInfoModal {...{requestInfoOpen, setRequestInfoOpen, selectedRowData}}/>
      )}
    </>
  );
};

export default LabRequestDataGrid;
