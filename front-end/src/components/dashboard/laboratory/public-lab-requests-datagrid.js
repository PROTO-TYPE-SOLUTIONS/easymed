import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager,
  HeaderFilter
 } from "devextreme-react/data-grid";
import { months } from "@/assets/dummy-data/laboratory";
import { Grid } from "@mui/material";
import { LuMoreHorizontal } from "react-icons/lu";
import { BiLogoOpera } from "react-icons/bi";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import ConvertToLabReq from "./convert-req-modal";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const getActions = () => {
  let actions = [
    { action: "public", label: "Convert request", icon: <BiLogoOpera className="text-card text-xl" /> },
  ];
 
  return actions;
};


const PublicLabRequestDataGrid = ({ publicLabRequests }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const userActions = getActions();
  const [open,setOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState({});


  //   FILTER PATIENTS BASED ON SEARCH QUERY
  const filteredData = publicLabRequests.filter((request) => {
    return request?.note
      ?.toLocaleLowerCase()
      .includes(searchQuery.toLowerCase());
  });


  const onMenuClick = async (menu, data) => {
   if (menu.action === "public") {
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
      </Grid>

      {/* DATAGRID STARTS HERE */}
      <DataGrid
        dataSource={publicLabRequests}
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
        <Column dataField="first_name" caption="First Name" width={180} />
        <Column dataField="second_name" caption="Last Name" width={180} />
        <Column
          dataField="reason"
          caption="Reason"
          width={180}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column
          dataField="status"
          caption="Status"
          width={180}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column
          dataField=""
          caption=""
          width={80}
          cellRender={actionsFunc}
        />
      </DataGrid>
      {open && <ConvertToLabReq {...{open,setOpen,selectedRowData}} />}
    </>
  );
};

export default PublicLabRequestDataGrid;
