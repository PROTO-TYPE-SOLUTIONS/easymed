import React, { useState } from "react";
import { Grid,Chip } from "@mui/material";
import dynamic from "next/dynamic";
import { Column, Paging, Pager,
  HeaderFilter
 } from "devextreme-react/data-grid";
import { LuMoreHorizontal } from "react-icons/lu";
import { AiOutlineDownload } from 'react-icons/ai';
import CmtDropdownMenu from "@/assets/DropdownMenu";
import AddPatientLabReq from "./AddLabReq";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});


const getActions = () => {
    let actions = [
      { action: "sample", label: "Confirm Sample Collection", icon: <AiOutlineDownload className="text-card text-xl" /> },
      { action: "equipment", label: "Send to equipment", icon: <AiOutlineDownload className="text-card text-xl" /> },
    ];
   
    return actions;
};
  

const PatientsLabRequestsGrid = () => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const userActions = getActions();
    const [open,setOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = React.useState({});


  //   FILTER PATIENTS BASED ON SEARCH QUERY
  //CHANGE THE SAMPLE DATA
  const filteredData = [{note:"star", sample: "sp-001"}, {note:"moon", sample:"sp-002"}].filter((request) => {
    return request?.note
      ?.toLocaleLowerCase()
      .includes(searchQuery.toLowerCase());
  });


  const onMenuClick = async (menu, data) => {
   if (menu.action === "sample") {
    //   delete api call
    }else if(menu.action === 'equipment'){
        setSelectedRowData(data)
        setOpen(true)
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
      <Grid item md={6} xs={12}>
        <input
          className="py-3 w-full focus:outline-none border border-gray px-4 placeholder-font font-thin text-sm"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          fullWidth
          placeholder="Search lab requests"
        />
      </Grid>
      <Grid className="w-full flex justify-end items-center" item md={6} xs={12}>
        <AddPatientLabReq/>
      </Grid>
    </Grid>

    {/* DATAGRID STARTS HERE */}
    <DataGrid
      dataSource={filteredData}
      allowColumnReordering={true}
      rowAlternationEnabled={true}
      showBorders={true}
      remoteOperations={true}
      showColumnLines={true}
      showRowLines={true}
      wordWrapEnabled={true}
      // allowPaging={true}
      // height={"70vh"}
      className="w-full shadow"
    >
      <Paging defaultPageSize={20} pageSize={20} />
      <HeaderFilter visible={true} />
      <Pager
        // visible={true}
        displayMode={true}
        showPageSizeSelector={false}
        showInfo={true}
        showNavigationButtons={true}
      />
      <Column dataField="note" caption="Note" width={180} />
      <Column dataField="sample" caption="Sample" width={180} />
      <Column
        dataField="requested_name"
        caption="Requested By"
        width={180}
        allowFiltering={true}
        allowSearch={true}
      />
      <Column
        dataField="number"
        caption="Action"
        width={80}
        cellRender={actionsFunc}
      />
    </DataGrid>
  </>
  )
}

export default PatientsLabRequestsGrid