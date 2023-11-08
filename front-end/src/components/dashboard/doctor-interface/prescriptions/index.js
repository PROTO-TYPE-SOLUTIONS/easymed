import { Grid } from "@mui/material";
import React from "react";
import { AiFillDelete } from 'react-icons/ai'

const AllPrescriptions = () => {
  return (
    <>
      <h1 className="text-xl my-4">Drugs</h1>
      <section className="flex items-center gap-2">
        <div className="w-7/12">
          <input
            className="block border bg-background rounded-3xl border-gray py-3 text-sm px-4 focus:outline-none w-full"
            type="text"
            placeholder="Search Drug..."
          />
        </div>
        <div>
          <button className="bg-primary rounded-3xl w-full px-4 text-sm py-3 text-white">
            Search
          </button>
        </div>
      </section>
      <section className="bg-white shadow p-4 rounded flex justify-between gap-4 my-3">
        <div>
          <h1 className="font-semibold">Drug Name</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <input
              className="block border rounded-3xl border-gray py-2 text-sm px-4 focus:outline-none w-full"
              type="text"
            />
            <input
              className="block border border-gray rounded-3xl py-2 text-sm px-4 focus:outline-none w-full"
              type="text"
            />
          </div>
          <div className="space-y-2">
            <input
              className="block border border-gray rounded-3xl py-2 text-sm px-4 focus:outline-none w-full"
              type="text"
            />
            <input
              className="block border border-gray rounded-3xl py-2 text-sm px-4 focus:outline-none w-full"
              type="text"
            />
          </div>
        </div>
        <div className="space-y-2">
          <button className="bg-primary w-full px-4 text-sm py-2 text-white">
            Save
          </button>
          <button className="border border-primary w-full px-4 text-sm py-2 flex items-center gap-2 text-primary">
            <AiFillDelete />
            Delete
          </button>
        </div>
      </section>
    </>
  );
};

export default AllPrescriptions;
