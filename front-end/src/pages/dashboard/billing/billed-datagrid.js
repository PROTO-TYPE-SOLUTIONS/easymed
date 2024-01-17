import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Scrolling } from "devextreme-react/data-grid";
import { Grid } from "@mui/material";

import { getAllInvoices } from '@/redux/features/billing';
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

    console.log("ALL INVOICES", invoices)

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
                
            </DataGrid>
        </section>
    )
}

export default BilledDataGrid;