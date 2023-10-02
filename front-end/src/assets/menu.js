// components/defaultNavItems.tsx
import React from "react";
import { BiSolidDashboard } from "react-icons/bi";
import { HiUsers } from "react-icons/hi";
import { RiMessage2Fill } from "react-icons/ri";
import { BsCalendarEvent } from "react-icons/bs";
import { MdLocalPharmacy } from "react-icons/md";
import { FaWheelchair } from "react-icons/fa";
import { FaClockRotateLeft, FaCodePullRequest } from "react-icons/fa6";
import { GrAdd } from 'react-icons/gr'
import { BsEyeFill } from 'react-icons/bs'

export const menus = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <BiSolidDashboard className="text-xl" />,
  },
  {
    label: "Laboratory",
    href: "/dashboard/laboratory",
    icon: <HiUsers className="text-xl" />,
  },
  {
    label: "Patients",
    href: "/dashboard/patients",
    icon: <HiUsers className="text-xl" />,
    children: [
      {
        label: "Add Patient",
        href: "/dashboard/patients",
        icon: <GrAdd className="" />,
      },
      {
        label: "Refer Patient",
        href: "/dashboard/patients/referrals",
        icon: <FaWheelchair className="" />,
      },
    ],
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: <RiMessage2Fill className="text-xl" />,
  },
  {
    label: "Schedule",
    href: "/dashboard/schedule",
    icon: <BsCalendarEvent className="text-xl" />,
  },
  {
    label: "Phamarcy",
    href: "/dashboard/phamarcy",
    icon: <MdLocalPharmacy className="text-2xl" />,
  },
];

export const dashboardData = [
  {
    label: "Patients waiting",
    number: 12,
    icon: <FaWheelchair className="text-xl" />,
  },
  {
    label: "Doctors on duty",
    number: 44,
    icon: <FaClockRotateLeft className="text-left" />,
  },
  {
    label: "Test Requests",
    number: 37,
    icon: <FaCodePullRequest className="text-xl" />,
  },
];
