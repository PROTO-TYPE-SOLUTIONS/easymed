import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; 
import dynamic from "next/dynamic";
import { Column, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import Link from 'next/link';
import { Grid } from "@mui/material";
import { months } from "@/assets/dummy-data/laboratory";
import { inventoryDisplayStats } from "@/assets/menu";
import { InventoryInfoCardsItem } from "@/components/dashboard/inventory/inventory-info-cards-item";
import { getAllInventories } from "@/redux/features/inventory";
import { useDispatch } from "react-redux";
import { useAuth } from "@/assets/hooks/use-auth";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const allowedPageSizes = [5, 10, 'all'];

const InventoryDataGrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { item, inventories } = useSelector((store) => store.inventory);
  const dispatch = useDispatch()
  const auth = useAuth();
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);

  useEffect(() => {
    if (auth) {
      dispatch(getAllInventories(auth));
    }
  }, [auth]);

  console.log(item)


  const inventorySummaryInfo = inventoryDisplayStats.map((item, index) => <InventoryInfoCardsItem key={`inventory-display-info ${index}`} itemData={item}/>)

  return (
    <section className=" my-8">
      <h3 className="text-xl mb-2"> Sales Summary </h3>
      <Grid container spacing={2}>
        {inventorySummaryInfo}      
      </Grid>
      <h3 className="text-xl mt-8"> Inventory </h3>
      <Grid className="my-2 flex justify-between gap-4">
        <Grid className="flex justify-between gap-8 rounded-lg w-full">
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
        <Grid className="flex items-center rounded-lg bg-white px-2 w-full" item md={4} xs={4}>
          <img className="h-4 w-4" src='/images/svgs/search.svg'/>
          <input
            className="py-2 w-full px-4 bg-transparent rounded-lg focus:outline-none placeholder-font font-thin text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            fullWidth
            placeholder="Search referrals by facility"
          />
        </Grid>
        <Grid className="bg-primary rounded-md flex items-center text-white w-full" item md={4} xs={4}>
          <Link className="mx-4 w-full text-center" href='/dashboard/inventory/add-inventory'>
            Add Inventory
          </Link>
        </Grid>
      </Grid>
      <DataGrid
        dataSource={inventories}
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
          dataField="item" 
          caption="Product Name"
          cellRender={(cellData) => {
            const prodName = item.find(prod => prod.id === cellData.data.item);
            return prodName ? `${prodName.name}` : 'NA';
          }}   
        />
        <Column dataField="purchase_price" caption="Purchase Price"/>
        <Column
          dataField="sale_price"
          caption="Sale price"
          allowFiltering={true}
          allowSearch={true}
        />
        <Column dataField="packed" caption="Packed"/>
        <Column dataField="subpacked" caption="Subpacked"/>
        <Column dataField="quantity_in_stock" caption="Quantity"/>
      </DataGrid>
    </section>
  );
};

export default InventoryDataGrid;
