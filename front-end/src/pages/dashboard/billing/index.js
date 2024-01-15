import React,{useState} from 'react'
import CustomizedLayout from "../../../components/layout/customized-layout";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Container } from '@mui/material';
import BilledDataGrid from './billed-datagrid';
import AddInvoiceModal from '@/components/dashboard/billing/add-invoice-modal';
import OverdueInvoices from '@/components/dashboard/billing/overdue-invoices';
import BillingReports from '@/components/dashboard/billing/billing-reports';
import InvoiceItems from '@/components/dashboard/billing/invoice-items';


const Billing = () => {
  const [currentTab,setCurrentTab] = useState(0)

  return (
    <Container maxWidth="xl" className='my-8'>
      <div className="flex items-center gap-4 my-8">
        <AddInvoiceModal />
        <button onClick={()=> setCurrentTab(2)} className={`${currentTab === 2 ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
          Overdue Invoices
        </button>
        <button onClick={()=> setCurrentTab(3)} className={`${currentTab === 3 ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
          View Items
        </button>
        <button onClick={()=> setCurrentTab(4)} className={`${currentTab === 4 ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
          Reports
        </button>
      </div>

      {currentTab === 0 && <BilledDataGrid /> }
      {/* {currentTab === 1 && <OverdueInvoices /> } */}
      {currentTab === 2 && <OverdueInvoices /> }
      {currentTab === 3 && <InvoiceItems /> }
      {currentTab === 4 && <BillingReports /> }
    </Container>
  )
}

Billing.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export default Billing