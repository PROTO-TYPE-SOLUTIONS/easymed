import React from "react";
import Sidebar from "./sidebar";
import Header from "./header";


const CustomizedLayout = ({ children }) => {
  return (
    <div className="md:flex gap-2 h-screen overflow-hidden sm:p-4 bg-background">
      <div className="w-52 bg-white shadow-xl rounded-xl md:block hidden">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-y-auto hideMiddleSectionScrollbar">
        <Header />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default CustomizedLayout;
