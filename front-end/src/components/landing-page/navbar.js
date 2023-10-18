import React,{ useState,useRef,useEffect } from "react";
import { Drawer } from "./drawer";
import { AiOutlineMenu } from "react-icons/ai";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="flex items-center justify-between h-[10vh]">
      <div>
        <h1 className="text-white text-2xl">Logo</h1>
      </div>
      <div className="md:block hidden">
        <ul className="flex items-center gap-4 text-white">
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
          <li>Doctors</li>
          <li>Blog</li>
        </ul>
      </div>
      <div className="md:block hidden">
        <button className="bg-primary px-4 py-2 text-white">
          Contact Us
        </button>
      </div>
      <div className="md:hidden block py-4">
        <AiOutlineMenu
          className="text-secondary text-2xl cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
        <Drawer isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </section>
  );
};

export default Navbar;
