import React, {useEffect, useState} from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { MdLocalPrintshop } from 'react-icons/md'
import dynamic from "next/dynamic";
import { Column, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import Link from 'next/link'
import { Grid } from "@mui/material";
import { months } from "@/assets/dummy-data/laboratory";
import { getAllPurchaseOrders } from "@/redux/features/inventory";
import { getAllDoctors } from "@/redux/features/doctors";
import { useAuth } from "@/assets/hooks/use-auth";
import { getAllTheUsers } from "@/redux/features/users";
import { downloadPDF } from '@/redux/service/pdfs';

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const allowedPageSizes = [5, 10, 'all'];

const PurchaseOrdersDatagrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { purchaseOrders } = useSelector(({ inventory }) => inventory);
  const usersData = useSelector((store)=>store.user.users);
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);

  const dispatch = useDispatch()
  const auth = useAuth();

  const renderGridCell = (rowData) => {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span
            style={{ marginLeft: '5px', cursor: 'pointer' }}
            onClick={() => handlePrint(rowData)}
          >
            <MdLocalPrintshop />
          </span>
        </div>
      );
  };

  const handlePrint = async (data) => {
    console.log(data.values[3]);
    try{
        const response = await downloadPDF(data.values[3], "_purchaseorder_pdf", auth)
        window.open(response.link, '_blank');
        toast.success("got pdf successfully")

    }catch(error){
        console.log(error)
        toast.error(error)
    }      
  };

  useEffect(() => {
    if (auth) {
      dispatch(getAllPurchaseOrders(auth));
      dispatch(getAllDoctors(auth))
      dispatch(getAllTheUsers(auth))
    }
  }, [auth]);

  return (
    <section className=" my-8">
      <h3 className="text-xl mb-8"> Purchase Orders </h3>
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
          <Link className="mx-4" href='/dashboard/inventory/add-purchase'>
            Purchase Product
          </Link>
        </Grid>
      </Grid>
      <DataGrid
        dataSource={purchaseOrders}
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
            const user = usersData.find(user => user.id === cellData.data.requested_by);
            return user ? `${user.first_name} ${user.last_name}` : 'user not found';
          }}
          />
        <Column 
          dataField="status"
          caption="Status"
        />
        <Column dataField="date_created" caption="Requested Date" />
        <Column
            dataField="id"
            caption=""
            alignment="center"
            cellRender={(rowData) => renderGridCell(rowData)}
        />
      </DataGrid>
    </section>
  );
};

export default PurchaseOrdersDatagrid;
