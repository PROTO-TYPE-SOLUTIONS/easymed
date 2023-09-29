import React from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager } from "devextreme-react/data-grid";
import { labData, months } from "@/assets/dummy-data/laboratory";
import { Grid,Chip } from "@mui/material";
import { LuMoreHorizontal } from "react-icons/lu";
import { AiFillDelete,AiOutlineDownload,AiFillPrinter } from 'react-icons/ai';
import CmtDropdownMenu from "@/assets/DropdownMenu";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const getActions = () => {
  let actions = [{ action: "download", label: "Download", icon: <AiOutlineDownload className="text-blue-400 text-xl" /> }];

  actions.push({ action: "print", label: "Print", icon: <AiFillPrinter className="text-xl" /> });

  actions.push({ action: "delete", label: "Delete", icon: <AiFillDelete className="text-red-700 text-xl" /> });
  return actions;
};


const LaboratoryDataGrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const userActions = getActions();

  //   FILTER PATIENTS BASED ON SEARCH QUERY
  const filteredData = labData.filter((patient) => {
    return patient?.name
      ?.toLocaleLowerCase()
      .includes(searchQuery.toLowerCase());
  });


  const onMenuClick = async (menu, data) => {
   if (menu.action === "delete") {
    //   delete api call
    }else if(menu.action === 'download'){
        // download function
    }else if(menu.action === 'print'){
        // print function
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


  const priorityFunc = ({ data }) => {
    if (data?.priority === "Priority") {
      return (
        <div className="flex items-center gap-2">
          <p>{data?.name}</p>
          <Chip variant="contained" size="small" style={{ backgroundColor: "#FC4B1B",color:'white' }} label={data?.priority} />
        </div>
      );
    }else{
        return <p>{data?.name}</p>
    }
  };


  return (
    <>
      <Grid container spacing={2} className="my-2">
        <Grid item md={4} xs={12}>
          <input
            className="rounded py-3 w-full px-2 focus:outline-none placeholder-font font-thin text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            fullWidth
            placeholder="Search patients by name"
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <select
            className="rounded px-4 w-full py-3 focus:outline-none"
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
            <button className="bg-white shadow border-primary py-3 px-4 rounded-l-xl w-full">
              Date
            </button>
            <button className="bg-white shadow border-primary py-3 px-4 w-full">
              Week
            </button>
            <button className="bg-white shadow border-primary py-3 px-4 rounded-r-xl w-full">
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
        allowPaging={true}
        height={"70vh"}
        className="w-full shadow"
      >
        <Paging defaultPageSize={20} pageSize={20} />
        <Pager
          visible={true}
          displayMode={true}
          showPageSizeSelector={false}
          showInfo={true}
          showNavigationButtons={true}
        />
        <Column dataField="number" caption="NO" width={80} />
        <Column dataField="id_number" caption="ID" width={140} />
        <Column dataField="name" caption="Name" width={140} cellRender={priorityFunc} />
        <Column
          dataField="age"
          caption="Age"
          width={100}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column dataField="test" caption="Test" width={140} />
        <Column dataField="gender" caption="Gender" width={100} />
        <Column
          dataField="number"
          caption="Action"
          width={80}
          cellRender={actionsFunc}
        />
      </DataGrid>
    </>
  );
};

export default LaboratoryDataGrid;
