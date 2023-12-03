import React,{useState} from 'react'
import CustomizedLayout from "../../../components/layout/customized-layout";
import { Container } from '@mui/material';
import BilledDataGrid from './billed-datagrid';
import InvoicesDataGrid from './invoices-datagrid';
import PaidInvoiceDataGrid from './paid-invoice-datagrid';


const Billing = () => {
  const [currentTab,setCurrentTab] = useState(0)
  return (
    <Container maxWidth="xl" className='my-8'>
      <section className="flex items-center gap-4 bg-white p-2 mb-4">
      <h1 onClick={() => setCurrentTab(0)} className={`${currentTab === 0 ? 'font-semibold' : ''} text-xl cursor-pointer`}>Billed</h1>
      <h1 onClick={() => setCurrentTab(1)} className={`${currentTab === 1 ? 'font-semibold' : ''} text-xl cursor-pointer`}>All Invoices</h1>
        <h1 onClick={() => setCurrentTab(2)} className={`${currentTab === 2 ? 'font-semibold' : ''} text-xl cursor-pointer`}>Paid Invoices</h1>
      </section>

      {currentTab === 0 && <BilledDataGrid /> }
      {currentTab === 1 && <InvoicesDataGrid /> }
      {currentTab === 2 && <PaidInvoiceDataGrid /> }
    </Container>
  )
}

Billing.getLayout = (page) => (
  <CustomizedLayout>{page}</CustomizedLayout>
)

export default Billing