import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Scrolling } from "devextreme-react/data-grid";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { LuMoreHorizontal } from "react-icons/lu";

import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { useAuth } from "@/assets/hooks/use-auth";
import { getAllInsurance, getAllInventoryInsurancePrices } from "@/redux/features/insurance";
import CreatePaymodeModal from "./modals/paymodes/CreatePayMode";
import EditPaymodeModal from "./modals/paymodes/EditPayMode";
import { getPaymentModes } from "@/redux/features/billing";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const allowedPageSizes = [5, 10, 'all'];

const getActions = () => {
  let actions = [
    // {
    //   action: "delete",
    //   label: "Delete",
    //   icon: <AiFillDelete className="text-warning text-xl mx-2" />,
    // },
    {
      action: "edit",
      label: "Edit",
      icon: <BiEdit className="text-xl text-success  mx-2" />,
    },
  ];

  return actions;
};

const PayModes = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = React.useState("");
  const userActions = getActions();
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState({});
  const { insurancePrices } = useSelector((store)=> store.insurance);
  const { paymodes } = useSelector((store)=> store.billing);
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);

  useEffect(()=> {
    if (auth){
      dispatch(getAllInsurance(auth));
      dispatch(getPaymentModes(auth))
    }

  }, [])


  const onMenuClick = async (menu, data) => {
    if (menu.action === "delete") {
      setSelectedRowData(data);
      setDeleteOpen(true);
    } else if (menu.action === "edit") {
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

  //   filter Insurance Prices based on search query
  const filteredPaymentModes = paymodes.filter((insurance) => {
    return insurance.paymet_mode.toLocaleLowerCase().includes(searchQuery.toLowerCase()) || insurance.paymet_mode.toLocaleLowerCase().includes(searchQuery.toLowerCase())
  });

  return (
    <section>
      <Grid className="my-2 flex justify-between gap-4">
        <Grid className="flex items-center rounded-lg bg-white px-2 w-full" item md={4} xs={4}>
          <img className="h-4 w-4" src='/images/svgs/search.svg'/>
          <input
            className="py-2 w-full px-4 bg-transparent rounded-lg focus:outline-none placeholder-font font-thin text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            fullWidth
            placeholder="Search by name"
          />
        </Grid>
        <div className="w-full flex justify-end">
          <CreatePaymodeModal />
        </div>
      </Grid>
      <DataGrid
        dataSource={filteredPaymentModes}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
        remoteOperations={true}
        showColumnLines={false}
        showRowLines={true}
        wordWrapEnabled={true}
        allowPaging={true}
        className="shadow-xl"
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
        <Column dataField="paymet_mode" caption="Mode" />
        <Column dataField="insurance_name" caption="Insurance" />
        <Column
          dataField="payment_category"
          caption="Category"
          allowFiltering={true}
          allowSearch={true}
        />
        <Column
          dataField=""
          caption=""
          width={80}
          cellRender={actionsFunc}
        />
      </DataGrid>
      <EditPaymodeModal {...{ open, setOpen, selectedRowData }} />
      {/* <DeleteUserModal {...{ deleteOpen, setDeleteOpen, selectedRowData }} /> */}
    </section>
  );
};

export default PayModes;
