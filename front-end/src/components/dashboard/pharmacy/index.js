import React, {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager } from "devextreme-react/data-grid";
import { Grid } from "@mui/material";
import { months } from "@/assets/dummy-data/laboratory";
import { getAllPrescriptions, getAllPrescribedDrugs, getAllPrescriptionsPrescribedDrugs } from "@/redux/features/pharmacy";
import { getAllDoctors } from "@/redux/features/doctors";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@/assets/hooks/use-auth";

import CmtDropdownMenu from "@/assets/DropdownMenu";
import { MdAddCircle } from "react-icons/md";
import { LuMoreHorizontal } from "react-icons/lu";
import ViewPrescribedDrugsModal from "./view-prescribed-drugs-modal";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const getActions = () => {
  let actions = [
    {
      action: "dispense",
      label: "Dispense",
      icon: <MdAddCircle className="text-success text-xl mx-2" />,
    },
  ];

  return actions;
};

const PharmacyDataGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const userActions = getActions();
  const [open,setOpen] = useState(false)
  const prescriptionsData = useSelector((store)=>store.prescription)
  const doctorsData = useSelector((store)=>store.doctor.doctors)
  const [selectedRowData,setSelectedRowData] = useState({});

  const dispatch = useDispatch();
  const auth = useAuth();


  useEffect(() => {
    if (auth) {
      dispatch(getAllPrescriptions(auth));
      dispatch(getAllPrescribedDrugs(auth));
      dispatch(getAllDoctors(auth));
    }
  }, [auth]);

  const onMenuClick = async (menu, data) => {
    if (menu.action === "dispense") {
      dispatch(getAllPrescriptionsPrescribedDrugs(data.id, auth))
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
        dataSource={prescriptionsData.prescriptions}
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
        <Pager
          visible={false}
          showPageSizeSelector={true}
          showNavigationButtons={true}
        />
        <Column dataField="id" caption="No" />
        <Column 
          dataField="start_date" 
          caption="Start Date" 
        />
        <Column 
          dataField="created_by" 
          caption="Doctor"
          cellRender={(cellData) => {
            const prescription = prescriptionsData.prescriptions.find(prescription => prescription.id === cellData.data.created_by);
            const doctor = doctorsData.find(doc => doc.id === prescription.created_by);
            return doctor ? `${doctor.first_name} ${doctor.last_name}` : 'Doctor not found';
          }}        
        />
        <Column 
          dataField="status" 
          caption="Status"
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
