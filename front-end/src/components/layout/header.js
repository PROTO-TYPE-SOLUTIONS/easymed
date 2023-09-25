import { Container } from "@mui/material";
import React, { useState } from "react";
import TopSection from "./rightbar/top-section";
import AddPatientModal from "../patient/add-patient-modal";
import { AiOutlineMenu } from "react-icons/ai";
import { Drawer } from "@/assets/drawer";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="sticky top-0 z-50 p-2 bg-white md:bg-opacity-30 md:backdrop-filter mb-4 md:backdrop-blur-lg">
        <Container maxWidth="xl">
          <section className="flex items-center justify-between gap-4">
            <div className="md:hidden block">
              <AiOutlineMenu
                className="text-2xl cursor-pointer"
                onClick={() => setIsOpen(true)}
              />
              <Drawer {...{ isOpen, setIsOpen }} />
            </div>
            <div className="flex items-center gap-4">
              <div className="md:block hidden">
                <AddPatientModal />
              </div>
              <button className="md:block hidden border-2 border-gray-300 rounded px-2 py-2 text-sm">
                Refer Patient
              </button>
              <button className="md:block hidden border-2 border-gray-300 rounded px-2 py-2 text-sm">
                View Referrals
              </button>
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
