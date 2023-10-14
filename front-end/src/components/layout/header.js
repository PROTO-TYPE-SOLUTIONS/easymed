import { Container } from "@mui/material";
import React, { useState } from "react";
import TopSection from "./rightbar/top-section";
import AddPatientModal from "../dashboard/patient/add-patient-modal";
import { AiOutlineMenu } from "react-icons/ai";
import { Drawer } from "@/assets/drawer";
import Link from "next/link";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="sticky top-0 py-2 bg-primary h-[10vh] shadow-xl mb-12">
        <Container maxWidth="xl">
          <section className="flex items-center justify-between gap-4">
            <div className="md:hidden block">
              <AiOutlineMenu
                className="text-2xl cursor-pointer"
                onClick={() => setIsOpen(true)}
              />
              <Drawer {...{ isOpen, setIsOpen }} />
            </div>
           
            <div className="md:hidden block">
              <TopSection />
            </div>
          </section>
        </Container>
      </section>
    </>
  );
};

export default Header;
