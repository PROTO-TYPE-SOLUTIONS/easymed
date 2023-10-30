import React,{ useState,useRef,useEffect } from "react";
import { Drawer } from "./drawer";
import { AiOutlineMenu } from "react-icons/ai";
import Link from "next/link";


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
        <Link href="/auth/login" className="bg-primary px-5 py-3 text-white mx-2">
          Login
        </Link>
        <Link href="/auth/register" className="bg-primary px-5 py-3 text-white mx-2">
          Register
        </Link>
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
