import React from "react";
import Sidebar from "./sidebar";
import CustomizedHeader from "./customized-header";
import { AiFillHome } from "react-icons/ai";

const menus = [
  {
    id: 1,
    icon: <AiFillHome />,
  },
  {
    id: 1,
    icon: <AiFillHome />,
  },
  {
    id: 1,
    icon: <AiFillHome />,
  },
];

const ProfileLayout = ({ children }) => {
  return (
    <div className="md:flex md:h-screen h-auto overflow-hidden px-4 py-2">
      <div className="w-28 bg-white border border-gray rounded-xl shadow-xl md:block hidden px-4">
        <section className="h-[10vh] flex items-center justify-center">
          <p className="">Logo</p>
        </section>
        <section className="py-8 space-y-8">
          {menus.map((menu) => (
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{menu.icon}</span>
            </div>
          ))}
        </section>
      </div>

      <div className="flex-1 overflow-y-auto hideMiddleSectionScrollbar">
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ProfileLayout;
