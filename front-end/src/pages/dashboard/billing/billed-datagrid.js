import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Scrolling } from "devextreme-react/data-grid";
import { Grid } from "@mui/material";
import { MdLocalPrintshop } from 'react-icons/md'

import { getAllInvoices } from '@/redux/features/billing';
import { downloadPDF } from '@/redux/service/pdfs';
import { useAuth } from '@/assets/hooks/use-auth';

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
    ssr: false,
  });
  
  const allowedPageSizes = [5, 10, 'all'];

const BilledDataGrid = () => {
    const dispatch = useDispatch();
    const auth = useAuth()
    const { invoices } = useSelector((store) => store.billing);

    const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
    const [showInfo, setShowInfo] = useState(true);
    const [showNavButtons, setShowNavButtons] = useState(true);

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
        console.log(data.values[5]);
        try{
            const response = await downloadPDF(data.values[5], "_invoice_pdf", auth)
            window.open(response.link, '_blank');
            toast.success("got pdf successfully")

        }catch(error){
            console.log(error)
            toast.error(error)
        }
        
    };

    useEffect(()=> {
        if(auth){
            dispatch(getAllInvoices(auth));
        }
    }, [auth]);

    return (
        <section clasName="">
            <DataGrid
                dataSource={invoices}
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
                    dataField="invoice_number"
                    caption="Invoice Number" 
                />
                <Column
                    dataField="invoice_date"
                    caption="Date" 
                />
                <Column
                    dataField="invoice_description"
                    caption="Description" 
                />
                <Column dataField="invoice_amount" caption="Amount" />
                <Column 
                    dataField="status"
                    caption="Status"
                />
                <Column
                    dataField="id"
                    caption=""
                    alignment="center"
                    cellRender={(rowData) => renderGridCell(rowData)}
                />
            </DataGrid>
        </section>
    )
}

export default BilledDataGrid;