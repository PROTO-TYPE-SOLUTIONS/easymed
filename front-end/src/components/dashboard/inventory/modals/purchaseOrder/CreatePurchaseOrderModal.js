import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Column, Paging, Pager, Scrolling, Selection } from "devextreme-react/data-grid";
import dynamic from "next/dynamic";
import themes from 'devextreme/ui/themes';
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { LuMoreHorizontal } from "react-icons/lu";
import { AiFillDelete } from "react-icons/ai";
import { CiSquareQuestion } from "react-icons/ci";
// import AddRequisitionItemModal from './AddRequisitionItemModal';
// import EditRequisitionItemModal from './EditRequisitionItemModal';
import { addPurchaseOrder, deleteRequisitionItem, updateRequisition } from '@/redux/service/inventory';
import EditRequisitionItemModal from '../requisition/EditRequisitionItemModal';

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

const CreatePurchaseOrderModal = ({ open, setOpen, selectedRowData, setSelectedRowData }) => {
    const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
    const [showInfo, setShowInfo] = useState(true);
    const [showNavButtons, setShowNavButtons] = useState(true);
    const userActions = getActions();
    const [editOpen, setEditOpen] = useState(false);
    const [selectedEditRowData, setSelectedEditRowData] = useState({})
    const [selectedItems, setSelectedItems] = useState(null)
    const [allMode, setAllMode] = useState('allPages');
    const [checkBoxesMode, setCheckBoxesMode] = useState(
        themes.current().startsWith('material') ? 'always' : 'onClick',
    );

    const handleSelectionChanged = (selectedRowKeys) => {
        setSelectedItems(selectedRowKeys);
    };

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


    const approveRequisition = async() => {
        const payload = {

            procurement_approved: true,
            status: 'completed'

        }
        try{
            await updateRequisition(payload, selectedRowData.id)
            const updatedData = {...selectedRowData, procurement_approved: true}
            setSelectedRowData(updatedData)

            // handleClose()

        }catch(error){
            console.log("ERROR", error)
        }
    }

    const generatePurchaseOrder = async () => {
        try{
            await addPurchaseOrder(payload, requisition_id)

        }catch(error){
            console.log("ERR", error)            
        }
    }



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
                    <h2 className='text-lg font-bold'>{selectedRowData?.requisition_number}</h2>
                    
                    <div className='flex gap-5'>
                        {!selectedRowData?.procurement_approved && (<button onClick={()=>approveRequisition()} className="bg-primary text-white text-sm rounded px-3 py-2"> Approve</button>)}
                        {(selectedRowData?.procurement_approved) && (selectedItems?.selectedRowKeys.length > 0) && (<button onClick={()=>generatePurchaseOrder()} className="bg-primary text-white text-sm rounded px-3 py-2"> generate po</button>)}
                    </div>
                </div>
            </DialogTitle>
            <DataGrid
                dataSource={selectedRowData?.procurement_approved ? selectedRowData?.items.filter((item)=>item.quantity_approved > 0) : selectedRowData?.items}
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
                onSelectionChanged={handleSelectionChanged}
            >
                {selectedRowData?.procurement_approved && (<Selection
                    mode="multiple"
                    selectAllMode={allMode}
                    showCheckBoxesMode={checkBoxesMode}
                />)}
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
                    dataField="quantity_at_hand"
                    caption="Re order Level" 
                />
                <Column 
                    dataField="quantity_at_hand"
                    caption="Quantity At Hand" 
                />
                <Column 
                    dataField="quantity_requested"
                    caption="Quantity Requested" 
                />
                <Column
                    dataField="quantity_approved"
                    caption="Quantity Approved" 
                />
                <Column 
                    dataField="buying_price"
                    caption="Buying Price" 
                />
                <Column 
                    dataField="selling_price"
                    caption="Selling Price" 
                />
                <Column 
                    calculateCellValue={(rowData) => !selectedRowData.procurement_approved ? rowData.quantity_requested * rowData.buying_price : rowData.quantity_approved * rowData.buying_price}
                    caption="Amount" 
                />
                {/* <Column 
                dataField="status"
                caption="Status"
                /> */}
                {!selectedRowData?.procurement_approved && (<Column
                    dataField="" 
                    caption=""
                    cellRender={actionsFunc}
                />)}
            </DataGrid>
            </DialogContent>
        </Dialog>
        <EditRequisitionItemModal setEditOpen={setEditOpen} editOpen={editOpen} requisition={selectedRowData} selectedEditRowData={selectedEditRowData} setSelectedRowData={setSelectedRowData}/>
        </section>
    )
}

export default CreatePurchaseOrderModal