import React, { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Grid } from "@mui/material";
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

import ViewPOItemsModal from './ViewPOItemsModal'
import GRNote from './GRNote'
import SupplierInvoice from './SupplierInvoice'
import { toast } from 'react-toastify';
import { addIncomingItem, createSupplierInvoice } from '@/redux/service/inventory';
import { useAuth } from '@/assets/hooks/use-auth';

const ReceiveIncomingItems = ({ open, setOpen, selectedRowData, setSelectedRowData }) => {
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState(null)
    const auth = useAuth()

    const handleClose = () => {
        setOpen(false);
    };

    const initialValues = {

        invoice_no : "",
        amount : "",
        note: "",
        status : "pending",
        supplier : selectedRowData ? selectedRowData?.items[0].preferred_supplier : "",
        purchase_order : selectedRowData?.id || ""
    
    }
    
    const validationSchema = Yup.object().shape({
        invoice_no: Yup.string().required("This field is required!"),
        amount: Yup.string().required("This field is required!"),
    });

    const postIncomings =  async (item, supplierInvoice) => {
        const payload = {
            "item_code": item.item_code,
            "purchase_price": item.buying_price,
            "sale_price": item.selling_price,
            "quantity": item.quantity_received,
            "category_one": "Resale",
            "item": item.item,
            "purchase_order": supplierInvoice.purchase_order,
            "supplier_invoice": supplierInvoice.purchase_order,
            "lot_no": item.lot_no,
            "expiry_date": new Date(item.expiry_date).toISOString().split('T')[0]
        }
        try {
            const response = await addIncomingItem(payload, auth)
            console.log("SAVED INCOMING ITEM", response)
        }catch(error){

        }
    }

    const saveIncomingItems = (incomingItems, supplierInvoice) => {
        incomingItems.forEach((item)=> postIncomings(item, supplierInvoice))        
    }

    const handleAddIncomingItem = async ( formvalues ) => {
        if(!selectedItems || selectedItems.selectedRowsData.length < 1){
            toast.error("No Item is selected")
            return
        }

        const payload = {
            ...formvalues,
        }

        try{

            const supplierInvoiceResponse = await createSupplierInvoice(payload, auth)
            console.log("CREATED A SUPPLIER INVOICE AND IS", supplierInvoiceResponse)
            // const gRNoteResponse = await createSupplierInvoice(payload, auth)
            saveIncomingItems(selectedItems.selectedRowsData, supplierInvoiceResponse)

        }catch(error){
            console.log("ERROE", error)
        }


    }
    

  return (
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
                    <h2 className='text-lg font-bold'>{selectedRowData?.PO_number}</h2>
                    <div className='flex gap-5'>
                        <h2 className='font-bold'> {`ordered by: ${selectedRowData?.ordered_by}`} </h2>
                    </div>
                </div>
            </DialogTitle>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleAddIncomingItem}
            >
              <Form className="">
                <div>
                    <h2 className='text-lg font-bold'>Supplier Invoice Details</h2>
                    <SupplierInvoice/>
                </div>
                <div>
                    <h2 className='text-lg font-bold'>Goods Received Note Details</h2>
                    <GRNote/>
                </div>
                <ViewPOItemsModal  
                    selectedRowData={selectedRowData} setSelectedRowData={setSelectedRowData}
                    setSelectedItems={setSelectedItems}
                />
                <Grid className='my-2' item md={12} xs={12}>
                    <div className="flex items-center justify-end">
                        <button
                        type="submit"
                        className="bg-primary rounded-xl text-sm px-8 py-2 text-white"
                        >
                        {loading && (
                            <svg
                            aria-hidden="true"
                            role="status"
                            className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            ></path>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="#1C64F2"
                            ></path>
                            </svg>
                        )}
                        Add Inventory
                        </button>
                    </div>
                </Grid>
              </Form>
            </Formik>
        </DialogContent>
    </Dialog>
  )
}

export default ReceiveIncomingItems