import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { Column, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import { Grid } from "@mui/material";
import { months } from "@/assets/dummy-data/laboratory";
import { useAuth } from "@/assets/hooks/use-auth";
import { getAllSupplierInvoice, getInvoice } from "@/redux/features/inventory";
import { API_URL } from "@/assets/api-endpoints";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const allowedPageSizes = [5, 10, 'all'];

function SupplierInvoicesDatagrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const auth = useAuth();
  const supplierInvoice = useSelector(({ inventory }) => inventory.supplierInvoice);
  // const invoice = useSelector(({ inventory }) => inventory.invoice);

  useEffect(() => {
    if (!auth || !auth.token) {
      console.error("Missing auth token");
      return;
    }
    dispatch(getAllSupplierInvoice(auth));
  }, [auth, dispatch]);

  const fullReportButton = ({ data }) => (
    <button
      onClick={() => {
        if (!auth || !auth.token) {
          console.error("Missing auth token");
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        };
        dispatch(getInvoice(data.id, config)); // Pass supplier_id and config
      }}
      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
    >
      Full Report
    </button>
  );

  return (
    <section className="my-8">
      <h3 className="text-xl mb-8">Supplier Invoices</h3>
      <Grid className="my-2 flex justify-between gap-4">
        <Grid className="w-full flex justify-between gap-8 rounded-lg">
          <select className="px-4 w-full py-2 border broder-gray rounded-lg focus:outline-none">
            <option value="" selected></option>
            {months.map((month, index) => (
              <option key={index} value={month.name}>{month.name}</option>
            ))}
          </select>
        </Grid>
        <Grid className="w-full bg-white px-2 flex items-center rounded-lg" item md={4} xs={4}>
          <img className="h-4 w-4" src='/images/svgs/search.svg' alt="search" />
          <input
            className="py-2 w-full px-4 bg-transparent rounded-lg focus:outline-none placeholder-font font-thin text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            placeholder="Search by invoice number"
          />
        </Grid>
      </Grid>

      <DataGrid
        dataSource={supplierInvoice}
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
        <Scrolling rowRenderingMode='virtual' />
        <Paging defaultPageSize={10} />
        <Pager
          visible={true}
          allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={true}
          showInfo={true}
          showNavigationButtons={true}
        />
        <Column dataField="invoice_no" caption="Invoice No." />
        <Column dataField="supplier_name" caption="Supplier" />
        <Column dataField="purchase_order_number" caption="PO Number" />
        <Column dataField="requisition_number" caption="Requisition No." />
        <Column
          dataField="status"
          caption="Status"
          cellRender={({ value }) => (
            <span className={`px-2 py-1 rounded-full text-sm ${value === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>  
              {value}
            </span>
          )}
        />
        <Column
          dataField="total_amount"
          caption="Total Amount"
          calculateCellValue={(data) => data.total_amount.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}
        />
        <Column
          dataField="date_created"
          caption="Date Created"
          calculateCellValue={(data) => new Date(data.date_created).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}
        />
        <Column caption="Actions" cellRender={fullReportButton} alignment="center" />
      </DataGrid>
    </section>
  );
}

export default SupplierInvoicesDatagrid;
