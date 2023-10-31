import InventoryLayout from "@/components/layout/inventory-layout";
import { Container, Grid } from "@mui/material";
import React from "react";
import { inventoryData } from "@/assets/menu";
import InventoryDataGrid from "@/components/dashboard/inventory";
import Link from "next/link";
import AuthGuard from "@/assets/hoc/auth-guard";

const Inventory = () => {
  return (
    <Container maxWidth="xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/inventory/add-inventory">
          <button className="bg-primary text-white text-sm rounded px-3 py-2 mb-1">
            Add Item
          </button>
        </Link>
        <button className="bg-primary text-white text-sm rounded px-3 py-2 mb-1">
          Sale Order
        </button>
        <button className="bg-primary text-white text-sm rounded px-3 py-2 mb-1">
          View Items
        </button>
      </div>
      <h1 className="mb-2 font-semibold">Sales Summary</h1>
      <Grid container spacing={1}>
        {inventoryData.map((data, index) => (
          <Grid key={index} item md={4} xs={12}>
            <section className=" bg-white shadow-xl border-primary rounded-xl px-4 py-3 h-20 flex items-center justify-center gap-4">
              <div className="text-2xl">{data?.icon}</div>
              <div className="text-center text-sm">
                <p className="">{data?.label}</p>
                <p className="text-[#02273D]">{data?.number}</p>
              </div>
            </section>
          </Grid>
        ))}
      </Grid>
      <InventoryDataGrid />
    </Container>
  );
};

Inventory.getLayout = (page) => (
  <AuthGuard>
    <InventoryLayout>{page}</InventoryLayout>;
  </AuthGuard>
);

export default Inventory;
