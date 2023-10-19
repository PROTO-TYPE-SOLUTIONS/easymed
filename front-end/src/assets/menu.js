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
import { MdInventory2 } from 'react-icons/md'
import { BiSolidPurchaseTagAlt } from 'react-icons/bi'
import { FaMoneyBillAlt } from 'react-icons/fa'
import { FaProductHunt } from 'react-icons/fa'
import { TbBrandBandlab } from 'react-icons/tb'

export const menus = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <BiSolidDashboard className="text-xl" />,
    children: [
      {
        label: "General Dashboard",
        href: "/dashboard",
        icon: <GrAdd className="" />,
      },
      {
        label: "Admin Dashboard",
        href: "/dashboard/admin-interface",
        icon: <GrAdd className="" />,
      },
      {
        label: "Doctor Dashboard",
        href: "/dashboard/doctor-interface",
        icon: <FaWheelchair className="" />,
      },
      {
        label: "Reception Dashboard",
        href: "/dashboard/reception-interface",
        icon: <FaWheelchair className="" />,
      },
    ],
  },
  {
    label: "Laboratory",
    href: "/dashboard/laboratory",
    icon: <TbBrandBandlab className="text-xl" />,
  },
  {
    label: "Patients",
    href: "/dashboard/patients",
    icon: <HiUsers className="text-xl" />,
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
    icon: <MdLocalPharmacy className="text-xl" />,
  },
  {
    label: "Inventory",
    href: "/dashboard/inventory",
    icon: <MdInventory2 className="text-xl" />,
    children: [
      {
        label: "Add Inventory",
        href: "/dashboard/inventory/add-inventory",
        icon: <GrAdd className="" />,
      },
    ],
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
export const adminData = [
  {
    label: "No. of Patients",
    number: 37,
    waiting: 17,
    status: 'Patients waiting',
    condition: 'Patients Discharged',
    condition_number: 13
  },
  {
    label: "No. of Doctors",
    number: 44,
    waiting: 3,
    status: 'Doctors On leave',
    condition: 'Doctors On Duty',
    condition_number: 41
  },
  {
    label: "Test Requests",
    number: 23,
    waiting: 12,
    status: 'Tests Approved',
    condition: 'Test Requests Pending',
    condition_number: 4
  },
];

export const doctorData = [
  {
    name: "Dr. Patrick",
    specialisation: 'Surgeon',
    image: "./images/doc.jpg",
    status: 'On duty',
  },
  {
    name: "Dr. Jairus",
    specialisation: 'Optician',
    image: "./images/doc.jpg",
    status: 'On duty',
  },
  {
    name: "Dr. Patrick",
    specialisation: 'Psychiatry',
    image: "./images/doc.jpg",
    status: 'On duty',
  },
  {
    name: "Dr. Patrick",
    specialisation: 'Psychiatry',
    image: "./images/doc.jpg",
    status: 'On duty',
  },
  {
    name: "Dr. Patrick",
    specialisation: 'Psychiatry',
    image: "./images/doc.jpg",
    status: 'On duty',
  },
  {
    name: "Dr. Jairus",
    specialisation: 'Dentist',
    image: "./images/doc.jpg",
    status: 'On duty',
  },
  {
    name: "Dr. Jairus",
    specialisation: 'Dentist',
    image: "./images/doc.jpg",
    status: 'On duty',
  },
  {
    name: "Dr. Jairus",
    specialisation: 'Dentist',
    image: "./images/doc.jpg",
    status: 'On duty',
  },
  {
    name: "Dr. Jairus",
    specialisation: 'Dentist',
    image: "./images/doc.jpg",
    status: 'On duty',
  },
];

export const bookedData = [
  {
    name: "Joseph Mmbone",
    date: '12th July 2024',
  },
  {
    name: "Mary Moraa",
    date: '12th July 2024',
  },
  {
    name: "Derrick Kimani",
    date: '12th July 2024',
  },
  {
    name: "Annete Mwihaki",
    date: '12th July 2024',
  },
];

export const inventoryData = [
  {
    label: "Today's Sales",
    number: 320,
    icon: <FaMoneyBillAlt className="" />,
  },
  {
    label: "Purchases",
    number: 28,
    icon: <BiSolidPurchaseTagAlt className="" />,
  },
  {
    label: "Total Products",
    number: 3222,
    icon: <FaProductHunt className="" />,
  },
];
