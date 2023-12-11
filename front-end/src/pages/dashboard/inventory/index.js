import React, { useState } from "react";
import { Container } from "@mui/material";
import InventoryDataGrid from "@/components/dashboard/inventory";
import AuthGuard from "@/assets/hoc/auth-guard";
import CustomizedLayout from "@/components/layout/customized-layout";
import IncomingItems from "@/components/dashboard/inventory/incoming-items";
import Reports from "@/components/dashboard/inventory/reports";

const Inventory = () => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Container maxWidth="xl">
      <div className="flex items-center gap-4 my-8">
        <button onClick={()=> setCurrentTab(0)} className={`${currentTab === 0 ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
          Inventory
        </button>
        <RequisitionModal />
        <button onClick={()=> setCurrentTab(2)} className={`${currentTab === 2 ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
          Incoming Items
        </button>
        <button onClick={()=> setCurrentTab(3)} className={`${currentTab === 3 ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
          Reports
        </button>
      </div>

      {currentTab === 0 && <InventoryDataGrid /> }
      {currentTab === 2 && <IncomingItems /> }
      {currentTab === 3 && <Reports /> }
    </Container>
  );
};

Inventory.getLayout = (page) => (
  <AuthGuard>
    <CustomizedLayout>{page}</CustomizedLayout>;
  </AuthGuard>
);

export default Inventory;
