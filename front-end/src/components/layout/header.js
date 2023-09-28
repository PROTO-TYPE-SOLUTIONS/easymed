import { Container } from "@mui/material";
import React, { useState } from "react";
import TopSection from "./rightbar/top-section";
import AddPatientModal from "../dashboard/patient/add-patient-modal";
import { AiOutlineMenu } from "react-icons/ai";
import { Drawer } from "@/assets/drawer";
import ReferPatientModal from "../dashboard/patient/refer-patient-modal";
import Link from "next/link";
import ReferralsDataGridModal from "../dashboard/patient/referrals-datagrid-modal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="sticky top-0 z-50 py-2 bg-white md:bg-opacity-30 md:backdrop-filter mb-4 md:backdrop-blur-lg mb-12">
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
              <ReferPatientModal />
              <ReferralsDataGridModal />
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
