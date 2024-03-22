import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager,
  HeaderFilter, Scrolling,
 } from "devextreme-react/data-grid";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { LuMoreHorizontal } from "react-icons/lu";
import { MdAddCircle } from "react-icons/md";
import { Chip } from "@mui/material";
import { getAllPatients } from "@/redux/features/patients";
import { useSelector,useDispatch } from "react-redux";
import AddTriageModal from './add-triage-modal';


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
  const { patients } = useSelector((store) => store.patient);
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);


  useEffect(() =>{
    dispatch(getAllPatients());
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

  //   filter users based on search query
  const filteredPatients = patients.filter((user) => {
    return user.first_name.toLocaleLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <section>
      <DataGrid
        dataSource={filteredPatients}
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
          dataField="first_name"
          caption="First Name"
          width={140}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column
          dataField="second_name"
          caption="Last Name"
          width={120}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column dataField="age" caption="Age" width={140} />
        <Column dataField="gender" caption="Gender" width={120} />
        <Column dataField="insurance" caption="Insurance" width={120} />
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

