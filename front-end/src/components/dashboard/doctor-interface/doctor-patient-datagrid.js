import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Selection,
  HeaderFilter, Scrolling,
 } from "devextreme-react/data-grid";
import AssignDoctorModal from "../reception-interface/assign-doctor-modal";
import { Chip } from "@mui/material";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { LuMoreHorizontal } from "react-icons/lu";
import ReferPatientModal from "../patient/refer-patient-modal";
import ConsultPatientModal from "./consult-modal";
import PrescribePatientModal from "./prescribe-patient-modal";
import { BiTransferAlt } from "react-icons/bi";
import { MdOutlineContactSupport } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllPatients, getAllProcesses } from "@/redux/features/patients";
import { getAllDoctorAppointments } from "@/redux/features/appointment";
import { useAuth } from "@/assets/hooks/use-auth";
import { BiSupport } from 'react-icons/bi'
import { GiMedicinePills } from 'react-icons/gi'
import { useRouter } from "next/router";
import LabModal from "./lab-modal";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const allowedPageSizes = [5, 10, 'all'];

const getActions = () => {
  let actions = [
    {
      action: "refer",
      label: "Refer Patient",
      icon: <BiTransferAlt className="text-card text-xl mx-2" />,
    },
    {
      action: "consult",
      label: "Consult",
      icon: <BiSupport className="text-card text-xl mx-2" />,
    },
    {
      action: "prescribe",
      label: "Prescribe",
      icon: <GiMedicinePills className="text-card text-xl mx-2" />,
    },
    {
      action: "send to lab",
      label: "Send To Lab",
      icon: <MdOutlineContactSupport className="text-card text-xl mx-2" />,
    },
  ];

  return actions;
};

const DoctorPatientDataGrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [selectedRowData, setSelectedRowData] = React.useState({});
  const [open, setOpen] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const [prescribeOpen, setPrescribeOpen] = useState(false);
  const [labOpen, setLabOpen] = useState(false);
  const userActions = getActions();
  const dispatch = useDispatch();
  const auth = useAuth();
  const { doctorAppointments } = useSelector((store) => store.appointment);
  const router = useRouter();
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);
  const { processes, patients } = useSelector((store)=> store.patient)

  const doctorsSchedules = processes.filter((process)=> process.track==="doctor")

  const patientNameRender = (cellData) => {
    const patient = patients.find((patient) => patient.id === cellData.data.patient);
    return patient ? `${patient.first_name} ${patient.second_name}` : ""
  }

  useEffect(() => {
    if (auth) {
      dispatch(getAllDoctorAppointments(auth.user_id));
      dispatch(getAllPatients());
      dispatch(getAllProcesses())
    }
  }, [auth]);

  const onMenuClick = async (menu, data) => {
    if (menu.action === "refer") {
      setSelectedRowData(data);
      setOpen(true);
    } else if (menu.action === "consult") {
      setSelectedRowData(data);
      setConsultOpen(true);
    } else if (menu.action === "prescribe") {
      router.push(`/dashboard/doctor-interface/prescribe/${data.prescription}`);
    } else if(menu.action === "send to lab"){
      setSelectedRowData(data);
      setLabOpen(true);
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

  const onSelectionChanged = (props) => {
    const { selectedRowKeys, selectedRowsData } = props;
    setSelectedRecords(selectedRowKeys);
  };

  const statusFunc = ({ data }) => {
    if (data?.status === "pending") {
      return (
        <Chip
          variant="contained"
          size="small"
          label={data.status}
          color="primary"
          className="bg-primary text-white"
        />
      );
    } else if (data?.status === "confirmed") {
      return (
        <Chip
          variant="contained"
          size="small"
          label={data.status}
          className="bg-success text-white"
        />
      );
    } else if (data?.status === "New Patient") {
      return (
        <Chip
          variant="contained"
          size="small"
          label={data.status}
          className="bg-card text-white"
        />
      );
    }
  };

  const dateCreated = ({ data }) => {
    const formattedDate = new Date(data.date_created).toLocaleDateString();
    return <div>{formattedDate}</div>
  }

  return (
    <section>
      <DataGrid
        dataSource={doctorsSchedules}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        onSelectionChanged={onSelectionChanged}
        selectedRowKeys={selectedRecords}
        showBorders={true}
        remoteOperations={true}
        showColumnLines={true}
        showRowLines={true}
        wordWrapEnabled={true}
        allowPaging={true}
        className="shadow-xl w-full"
        // height={"70vh"}
      >
        {/* <Selection
          mode="multiple"
          selectAllMode={"allMode"}
          showCheckBoxesMode={checkBoxesMode}
        /> */}
        <HeaderFilter visible={true} />
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
          dataField="track_number"
          caption="Process Id"
          width={320}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column
          dataField="patient"
          caption="Patient Name"
          width={150}
          allowFiltering={true}
          allowSearch={true}
          cellRender={patientNameRender}
        />
        <Column dataField="reason" caption="Reason" width={200} />
        <Column
          dataField=""
          caption="Action"
          width={140}
          cellRender={actionsFunc}
        />
      </DataGrid>
      <ReferPatientModal {...{ open, setOpen, selectedRowData }} />
      <ConsultPatientModal
        {...{ consultOpen, setConsultOpen, selectedRowData }}
      />
      <PrescribePatientModal
        {...{ prescribeOpen, setPrescribeOpen, selectedRowData }}
      />
      <LabModal
        {...{ labOpen, setLabOpen, selectedRowData }}
      />
    </section>
  );
};

export default DoctorPatientDataGrid;
