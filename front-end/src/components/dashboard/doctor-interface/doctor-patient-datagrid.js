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
import { getAllPatients } from "@/redux/features/patients";
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

  

  useEffect(() => {
    if (auth) {
      dispatch(getAllDoctorAppointments(auth.user_id));
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
      // router.push('/dashboard/doctor-interface/prescription');
      const encodedData = encodeURIComponent(JSON.stringify(data));
      router.push(`/dashboard/doctor-interface/prescribe/${data.patient}`);
      // setSelectedRowData(data);
      // setPrescribeOpen(true);
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
        dataSource={doctorAppointments}
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
        <Paging defaultPageSize={5} />
        <Pager
          visible={true}
          allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={showPageSizeSelector}
          showInfo={showInfo}
          showNavigationButtons={showNavButtons}
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
          width={120}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column
          dataField="age"
          caption="Age"
          width={120}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column
          dataField="gender"
          caption="Gender"
          width={140}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column
          dataField="date_created"
          caption="Date Created"
          width={140}
          allowFiltering={true}
          allowSearch={true}
          cellRender={dateCreated}
        />
        <Column
          dataField="status"
          caption="Status"
          width={140}
          cellRender={statusFunc}
        />
        {/* <Column
          dataField="assigned_doctor"
          caption="Assigned Doctor"
          width={200}
        /> */}
        <Column dataField="reason" caption="Reason" width={140} />
        <Column
          dataField="country"
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
