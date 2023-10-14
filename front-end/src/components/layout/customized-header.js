import { Container } from "@mui/material";
import React, { useState } from "react";
import TopSection from "./rightbar/top-section";
import AddPatientModal from "../dashboard/patient/add-patient-modal";
import { AiOutlineMenu } from "react-icons/ai";
import { Drawer } from "@/assets/drawer";
import ReferPatientModal from "../dashboard/patient/refer-patient-modal";
import Link from "next/link";

const CustomizedHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="sticky top-0 py-2 bg-primary shadow-xl h-[10vh]">
        <Container maxWidth="xl">
          <section className="flex items-center justify-between gap-4">
            <div className="md:hidden block">
              <AiOutlineMenu
                className="text-2xl cursor-pointer"
                onClick={() => setIsOpen(true)}
              />
              <Drawer {...{ isOpen, setIsOpen }} />
            </div>
          </section>
        </Container>
      </section>
    </>
  );
};

export default CustomizedHeader;
