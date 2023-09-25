import React, { useState } from "react";
import { AiFillLock, AiOutlineQuestionCircle } from "react-icons/ai";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { menus } from "@/assets/menu";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <>
      <section className="">
        <header className="h-[10vh] shadow flex items-center justify-center font-bold">
          <h1>Logo</h1>
        </header>
        <section className="my-4 p-4 h-[84vh] flex flex-col justify-between">
          <div>
            <ul className="space-y-4 mb-4 overflow-y-auto">
              {menus.map((menu, index) => (
                <li key={index}>
                  <>
                    <Link
                      href={menu.href}
                      className={`flex items-center text-sm justify-between py-2 px-2 cursor-pointer ${
                        currentPath === menu.href
                          ? "text-[#02787B] font-semibold"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6">{menu.icon}</span>{" "}
                        <span>{menu.label}</span>
                      </div>
                    </Link>
                  </>
                </li>
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
