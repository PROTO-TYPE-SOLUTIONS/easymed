import InventoryLayout from "@/components/layout/inventory-layout";
import { Container, Grid } from "@mui/material";
import React from "react";
import { inventoryData } from "@/assets/menu";
import InventoryDataGrid from "@/components/dashboard/inventory";

const Inventory = () => {
  return (
    <Container maxWidth="xl">
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

Inventory.getLayout = (page) => <InventoryLayout>{page}</InventoryLayout>;

export default Inventory;
