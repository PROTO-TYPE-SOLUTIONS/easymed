import AddInventoryForm from "@/components/dashboard/inventory/add-inventory";
import InventoryLayout from "@/components/layout/inventory-layout";
import { Container } from "@mui/material";
import Link from "next/link";
import React from "react";
import { GrLinkPrevious } from "react-icons/gr";

const AddInventory = () => {
  return (
    <Container maxWidth="xl" className="space-y-8">
      <button className="font-semibold">
        <Link href="/dashboard/inventory" className="flex items-center gap-2">
          <GrLinkPrevious />
          <h1>Back</h1>
        </Link>
      </button>
      <AddInventoryForm />
    </Container>
  );
};

AddInventory.getLayout = (page) => <InventoryLayout>{page}</InventoryLayout>;

export default AddInventory;
