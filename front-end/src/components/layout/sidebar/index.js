import React, { useState } from "react";
import { menus } from "@/assets/menu";
import MenuChild  from "./menu-children";
import { IoMdSettings } from "react-icons/io";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import Link from "next/link";
import { BsFillExclamationCircleFill } from "react-icons/bs";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <section className="">
        <header className="h-[10vh] shadow flex items-center justify-center font-bold">
          <h1>Logo</h1>
        </header>
        <section className="pl-2 h-[84vh] flex flex-col justify-between">
          <div className="overflow-x-auto">
            <ul className="space-y-3 my-4 ">
              {menus.map((menu, index) => (
                <MenuChild key={index} {...{ index, menu, collapsed }} />
              ))}
            </ul>
          </div>
          <div className="space-y-2 mb-4 pl-4 text-xs">
            <Link href="/dashboard/admin-interface" className="flex items-center gap-2">
              <IoMdSettings className="" />
              <p>Settings</p>
            </Link>
            <div className="flex items-center gap-2 text-xs">
              <AiOutlineQuestionCircle className="" />
              <p>Support</p>
            </div>
            <div className="flex items-center gap-2">
              <BsFillExclamationCircleFill className="" />
              <p>Make - Easy HMIS v1.0</p>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default Sidebar;
