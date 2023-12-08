import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Column,
  Paging,
  Pager,
  HeaderFilter,
} from "devextreme-react/data-grid";
import AddPatientModal from "./add-patient-modal";
import { Chip } from "@mui/material";
import { getAllPatients } from "@/redux/features/patients";
import { useSelector, useDispatch } from "react-redux";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { MdAddCircle } from "react-icons/md";
import { LuMoreHorizontal } from "react-icons/lu";
import CreateAppointmentModal from "./create-appointment-modal";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const getActions = () => {
  let actions = [
    {
      action: "add",
      label: "Create Appointment",
      icon: <MdAddCircle className="text-success text-xl mx-2" />,
    },
  ];

  return actions;
};

const PatientsDataGrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { patients } = useSelector((store) => store.patient);
  const dispatch = useDispatch();
  const userActions = getActions();
  const [open,setOpen] = useState(false)
  const [selectedRowData,setSelectedRowData] = useState({});


  const onMenuClick = async (menu, data) => {
    if (menu.action === "add") {
      setSelectedRowData(data);
      setOpen(true);
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
        <Chip
          variant="contained"
          size="small"
          className="bg-primary text-white"
          label={data.progress_status}
        />
      );
    } else if (data?.progress_status === "Discharged") {
      return (
        <Chip
          variant="contained"
          size="small"
          className="bg-success text-white"
          label={data.progress_status}
        />
      );
    } else if (data?.progress_status === "New Patient") {
      return (
        <Chip
          variant="contained"
          size="small"
          className="bg-card text-white"
          label={data.progress_status}
        />
      );
    }
  };

  useEffect(() => {
    dispatch(getAllPatients());
  }, []);

  return (
    <>
    <section className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <AddPatientModal />
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
        allowPaging={false}
        className="shadow-xl w-full"
        height={"60vh"}
      >
        <HeaderFilter visible={true} />
        <Pager
          visible={false}
          // allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={true}
          showNavigationButtons={true}
        />

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
          width={140}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column
          dataField="age"
          caption="Age"
          width={100}
          // calculateCellValue={(data) => calculateAge(data.date_of_birth)}
        />
        <Column dataField="gender" caption="Gender" width={140} />
        <Column dataField="insurance" caption="Insurance" width={100} />
        <Column
          dataField=""
          caption="Status"
          width={140}
          cellRender={statusFunc}
        />
        <Column
          dataField=""
          caption="Action"
          width={140}
          cellRender={actionsFunc}
        />
      </DataGrid>
    </section>

    {open && <CreateAppointmentModal {...{setOpen,open,selectedRowData}} />}
    </>
  );
};

export default PatientsDataGrid;
