import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getAllInvoices } from '@/redux/features/billing';
import { DataGrid, Column, Paging, Pager, Scrolling } from 'devextreme-react/data-grid';
import ErrorAlert from '@/components/common/ErrorAlert';

const allowedPageSizes = [10, 25, 50];

const OverdueInvoices = () => {
    const dispatch = useDispatch();
    const { invoices } = useSelector((state) => state.billing);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchInvoices = async () => {
        try {
          setIsLoading(true);
          await dispatch(getAllInvoices());
        } catch (error) {
          setError(error.message);
          toast.error('Failed to fetch invoices');
        } finally {
          setIsLoading(false);
        }
      };

      fetchInvoices();
    }, [dispatch]);

    const actionsFunc = (cellData) => {
      return (
        <div className="flex gap-2">
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => handleViewInvoice(cellData.data)}
          >
            View
          </button>
        </div>
      );
    };

    return (
      <section className="p-4">
        {error && <ErrorAlert message={error} />}
      
        <DataGrid
          dataSource={invoices}
          allowColumnReordering
          rowAlternationEnabled
          showBorders
          remoteOperations
          showColumnLines
          showRowLines
          wordWrapEnabled
          allowPaging
          className="shadow-xl"
          loading={isLoading}
        >
          <Scrolling rowRenderingMode='virtual' />
          <Paging defaultPageSize={10} />
          <Pager
            visible
            allowedPageSizes={allowedPageSizes}
            showPageSizeSelector
            showInfo
            showNavigationButtons
          />
          <Column dataField="invoice_number" caption="Invoice Number" />
          <Column dataField="invoice_date" caption="Date" />
          <Column dataField="invoice_description" caption="Description" />
          <Column dataField="invoice_amount" caption="Amount" />
          <Column dataField="status" caption="Status" />
          <Column dataField="" caption="Actions" cellRender={actionsFunc} />
        </DataGrid>
      </section>
    );
};

export default OverdueInvoices;
