import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager,
  HeaderFilter
 } from "devextreme-react/data-grid";
import { labData, months } from "@/assets/dummy-data/laboratory";
import { Grid,Chip } from "@mui/material";
import { LuMoreHorizontal } from "react-icons/lu";
import { AiOutlineDownload } from 'react-icons/ai';
import CmtDropdownMenu from "@/assets/DropdownMenu";
import EquipmentModal from "./equipment-modal";

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


const LabRequestDataGrid = ({ labRequests }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const userActions = getActions();
  const [open,setOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState({});


  //   FILTER PATIENTS BASED ON SEARCH QUERY
  const filteredData = labRequests.filter((request) => {
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
        <Column dataField="sample_id" caption="Sample" width={180} />
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
      {open && <EquipmentModal {...{open,setOpen,selectedRowData}} />}
    </>
  );
};

export default LabRequestDataGrid;
