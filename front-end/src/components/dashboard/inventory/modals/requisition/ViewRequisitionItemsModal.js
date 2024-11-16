import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Column, Paging, Pager, Scrolling } from "devextreme-react/data-grid";
import dynamic from "next/dynamic";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { LuMoreHorizontal } from "react-icons/lu";
import { MdLocalPrintshop } from 'react-icons/md';
import { CiSquareQuestion } from "react-icons/ci";
import AddRequisitionItemModal from './AddRequisitionItemModal';
import EditRequisitionItemModal from './EditRequisitionItemModal';

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
    ssr: false,
});
  
const allowedPageSizes = [5, 10, 'all'];

const getActions = () => {
    let actions = [
      {
        action: "edit",
        label: "Edit Item",
        icon: <CiSquareQuestion className="text-success text-xl mx-2" />,
      },
    ];
  
    return actions;
  };

const ViewRequisitionItemsModal = ({ open, setOpen, selectedRowData, setSelectedRowData }) => {
    const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
    const [showInfo, setShowInfo] = useState(true);
    const [showNavButtons, setShowNavButtons] = useState(true);
    const userActions = getActions();
    const [editOpen, setEditOpen] = useState(false);
    const [selectedEditRowData, setSelectedEditRowData] = useState({})

    const handleClose = () => {
        setOpen(false);
    };

    const onMenuClick = async (menu, data) => {
        if (menu.action === "edit") {
          setSelectedEditRowData(data);
          setEditOpen(true);
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
        <section>
            
        <Dialog
            fullWidth
            maxWidth="lg"
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
            <DialogTitle>
                <div className='flex justify-between'>
                    <h2 className='text-lg font-bold'>Requested Items</h2>
                    <AddRequisitionItemModal requisition={selectedRowData} setSelectedRowData={setSelectedRowData}/>
                </div>
            </DialogTitle>
            <DataGrid
                dataSource={selectedRowData?.items}
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
                <Paging defaultPageSize={10} />
                <Pager
                visible={true}
                allowedPageSizes={allowedPageSizes}
                showPageSizeSelector={showPageSizeSelector}
                showInfo={showInfo}
                showNavigationButtons={showNavButtons}
                />
                <Column
                    dataField="item_code"
                    caption="Item code"
                />
                <Column
                    dataField="item_name"
                    caption="Item name"
                />
                <Column dataField="preferred_supplier_name" caption="Preferred Supplier" />
                <Column 
                    dataField="quantity_requested"
                    caption="Quantity Requested" 
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
            </DialogContent>
        </Dialog>
        <EditRequisitionItemModal setEditOpen={setEditOpen} editOpen={editOpen} requisition={selectedRowData} selectedEditRowData={selectedEditRowData} setSelectedRowData={setSelectedRowData}/>
        </section>
    )
}

export default ViewRequisitionItemsModal