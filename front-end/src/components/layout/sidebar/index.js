import React, { useState } from "react";
import { AiFillLock, AiOutlineQuestionCircle } from "react-icons/ai";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { menus } from "@/assets/menu";
import MenuChild  from "./menu-children";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <section className="">
        <header className="h-[10vh] shadow flex items-center justify-center font-bold">
          <h1>Logo</h1>
        </header>
        <section className="p-4 h-[84vh] flex flex-col justify-between">
          <div className="h-3/14 overflow-x-auto">
            <ul className="space-y-4 my-4 ">
              {menus.map((menu, index) => (
                <MenuChild key={index} {...{ index, menu, collapsed }} />
              ))}
            </ul>
          </div>
          <div style={{ fontSize: "10px" }} className="space-y-4 mb-4">
            <div className="flex items-center gap-2">
              <AiFillLock className="text-xl" />
              <p>Logout</p>
            </div>
            <div className="flex items-center gap-2">
              <IoMdSettings className="text-xl" />
              <p>Settings</p>
            </div>
            <div className="flex items-center gap-2">
              <AiOutlineQuestionCircle className="text-xl" />
              <p>Support</p>
            </div>
            <div className="flex items-center gap-2">
              <BsFillExclamationCircleFill className="text-xl" />
              <p>Make - Easy HMIS v1.0</p>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default Sidebar;
