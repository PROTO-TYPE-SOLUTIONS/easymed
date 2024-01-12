import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Scrolling } from "devextreme-react/data-grid";
import Link from 'next/link'
import { Grid } from "@mui/material";
import { months } from "@/assets/dummy-data/laboratory";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/assets/hooks/use-auth";
import { getAllRequisitions, getAllSuppliers, getAllItems } from "@/redux/features/inventory";
import { getAllDoctors } from "@/redux/features/doctors";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const allowedPageSizes = [5, 10, 'all'];

const RequisitionDatagrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { requisitions } = useSelector(({ inventory }) => inventory);
  const doctorsData = useSelector((store)=>store.doctor.doctors);
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);

  const dispatch = useDispatch()
  const auth = useAuth();

  useEffect(() => {
    if (auth) {
      dispatch(getAllRequisitions(auth));
      dispatch(getAllSuppliers());
      dispatch(getAllItems());
      dispatch(getAllDoctors(auth))
    }
  }, [auth]);

  return (
    <section className=" my-8">
      <h3 className="text-xl mb-8"> Requisitions</h3>
      <Grid className="my-2 flex justify-between">
        <Grid className="flex justify-between gap-8 rounded-lg">
          <Grid item md={4} xs={4}>
            <select className="px-4 w-full py-2 border broder-gray rounded-lg focus:outline-none" name="" id="">
              <option value="" selected>                
              </option>
              {months.map((month, index) => (
                <option key={index} value="">
                  {month.name}
                </option>
              ))}
            </select>
          </Grid>
          <Grid>
          <select className="px-4 w-full py-2 border broder-gray rounded-lg focus:outline-none" name="" id="">
              <option value="" selected>
                All the Items
              </option>
            </select>
          </Grid>        
        </Grid>
        <Grid className="flex items-center rounded-lg" item md={4} xs={4}>
          <img className="h-4 w-4" src='/images/svgs/search.svg'/>
          <input
            className="py-2 w-full px-4 bg-transparent rounded-lg focus:outline-none placeholder-font font-thin text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            fullWidth
            placeholder="Search referrals by facility"
          />
        </Grid>
        <Grid className="bg-primary rounded-md flex items-center text-white" item md={4} xs={4}>
          <Link className="mx-4" href='/dashboard/inventory/create-requisition'>
            Create Requisition
          </Link>
        </Grid>
      </Grid>
      <DataGrid
        dataSource={requisitions}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
        remoteOperations={true}
        showColumnLines={true}
        showRowLines={true}
        wordWrapEnabled={true}
        allowPaging={true}
        className="shadow-xl"
        // height={"70vh"}
      >
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
          dataField="requested_by"
          caption="Requested By" 
          cellRender={(cellData) => {
            const doctor = doctorsData.find(doc => doc.id === cellData.data.requested_by);
            return doctor ? `${doctor.first_name} ${doctor.last_name}` : 'Doctor not found';
          }}
          />
        <Column 
          dataField="status"
          caption="Status"
        />
        <Column dataField="date_created" caption="Requested Date" />
      </DataGrid>
    </section>
  );
};

export default RequisitionDatagrid;
