import React, {useEffect, useState} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { MdLocalPrintshop } from 'react-icons/md'
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Scrolling } from "devextreme-react/data-grid";
import { Grid } from "@mui/material";
import { months } from "@/assets/dummy-data/laboratory";
import { getAllPrescriptions, getAllPrescribedDrugs, getAllPrescriptionsPrescribedDrugs } from "@/redux/features/pharmacy";
import { getAllDoctors } from "@/redux/features/doctors";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@/assets/hooks/use-auth";
import { downloadPDF } from '@/redux/service/pdfs';
import { getAllPatients, getAllProcesses } from "@/redux/features/patients";


import CmtDropdownMenu from "@/assets/DropdownMenu";
import { MdAddCircle } from "react-icons/md";
import { LuMoreHorizontal } from "react-icons/lu";
import ViewPrescribedDrugsModal from "./view-prescribed-drugs-modal";
import { GiMedicinePills } from "react-icons/gi";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const allowedPageSizes = [5, 10, 'all'];

const getActions = () => {
  let actions = [
    {
      action: "prescribe",
      label: "Prescribe",
      icon: <GiMedicinePills className="text-card text-xl mx-2" />,
    },
    {
      action: "dispense",
      label: "Dispense",
      icon: <MdAddCircle className="text-success text-xl mx-2" />,
    },
    {
      action: "print",
      label: "Print",
      icon: <MdLocalPrintshop className="text-success text-xl mx-2" />,
    },
  ];

  return actions;
};

const PharmacyDataGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const userActions = getActions();
  const router = useRouter();
  const [open,setOpen] = useState(false)
  const prescriptionsData = useSelector((store)=>store.prescription)
  const { doctors } = useSelector((store)=>store.doctor)
  const [selectedRowData,setSelectedRowData] = useState({});
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);
  const { processes, patients } = useSelector((store)=> store.patient)
  const filteredProcesses = processes.filter((process) => process.track === "pharmacy");

  console.log("FILTERED PROCESSES TRIAGE", filteredProcesses)

  const patientNameRender = (cellData) => {
    const patient = patients.find((patient) => patient.id === cellData.data.patient);
    return patient ? `${patient.first_name} ${patient.second_name}` : ""
  }

  const doctorNameRender = (cellData) => {
    const doctor = doctors.find((doctor) => doctor.id === cellData.data.doctor);
    return doctor ? `${doctor.first_name} ${doctor.last_name}` : ""
  }

  const dispatch = useDispatch();
  const auth = useAuth();

  const handlePrint = async (data) => {

    try{
        const response = await downloadPDF(data.prescription, "_prescription_pdf", auth)
        window.open(response.link, '_blank');
        toast.success("got pdf successfully")

    }catch(error){
        console.log(error)
        toast.error(error)
    }      
  };


  useEffect(() => {
    if (auth) {
      dispatch(getAllPrescriptions(auth));
      dispatch(getAllPrescribedDrugs(auth));
      dispatch(getAllDoctors(auth));
      dispatch(getAllPatients())
      dispatch(getAllProcesses())
    }
  }, [auth]);

  const onMenuClick = async (menu, data) => {
    if (menu.action === "dispense") {
      dispatch(getAllPrescriptionsPrescribedDrugs(data.prescription, auth))
      setSelectedRowData(data);
      setOpen(true);
    }else if (menu.action === "print"){
      handlePrint(data);
    }else if (menu.action === "prescribe") {
      router.push(`/dashboard/doctor-interface/${data.id}/${data.prescription}`);
    }
  };

  const actionsFunc = ({ data }) => {
    return (
        <CmtDropdownMenu
          sx={{ cursor: "pointer" }}
          items={userActions}
          onItemClick={(menu) => onMenuClick(menu, data)}
          TriggerComponent={
            <LuMoreHorizontal className="cursor-pointer text-xl" />
          }
        />
    );
  };

  return (
    <section className=" my-0">
      <Grid container spacing={2} className="mb-4 mt-2">
      <Grid item md={4} xs={12}>
          <select className="px-4 w-full py-2 focus:outline-none" name="" id="">
            {months.map((month, index) => (
              <option key={index} value="">
                {month.name}
              </option>
            ))}
          </select>
        </Grid>
        <Grid item md={6} xs={12}>
          <input
            className="py-2 w-full px-4 focus:outline-none placeholder-font font-thin text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            placeholder="Search by name or title"
          />
        </Grid>
      </Grid>
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
        className="shadow-xl"

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
        <Column width={120} dataField="patient_number" caption="PID" />
        <Column 
          dataField="patient" 
          caption="Patient Name"
          cellRender={patientNameRender} 
        />
        <Column 
          dataField="doctor" 
          caption="Doctor"
          cellRender={doctorNameRender}        
        />
        <Column 
          dataField="" 
          caption=""
          cellRender={actionsFunc}
        />
      </DataGrid>
      {open && <ViewPrescribedDrugsModal {...{setOpen,open,selectedRowData}} />}
    </section>
  );
};

export default PharmacyDataGrid;
