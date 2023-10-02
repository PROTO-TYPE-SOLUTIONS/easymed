import React, { useState, ReactNode } from "react";
import Sidebar from "./sidebar";
import RightBar from "./rightbar";
import Header from "./header";


const InventoryLayout = ({ children }) => {
  return (
    <div className="md:flex gap-2 h-screen overflow-hidden sm:p-4 bg-background">
      <div className="w-52 bg-white shadow-xl border-primary rounded-xl md:block hidden">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-y-auto hideMiddleSectionScrollbar">
        <Header />
        <div className="">{children}</div>
      </div>
      <div className="w-72 md:block hidden">
        <RightBar />
      </div>
    </div>
  );
};

export default InventoryLayout;
