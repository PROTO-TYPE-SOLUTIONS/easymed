import React from "react";
import Sidebar from "./sidebar";
import Header from "./header";


const ReferralLayout = ({ children }) => {
  return (
    <div className="md:flex gap-4 h-screen overflow-hidden sm:p-4">
      <div className="w-52 border-2 border-gray-400 rounded-xl md:block hidden">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-y-auto hideMiddleSectionScrollbar">
        <Header />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ReferralLayout;
