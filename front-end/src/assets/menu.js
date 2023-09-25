// components/defaultNavItems.tsx
import React from "react";
import { BiSolidDashboard } from 'react-icons/bi'
import { HiUsers } from 'react-icons/hi'
import { RiMessage2Fill } from 'react-icons/ri'
import { BsCalendarEvent } from 'react-icons/bs'
import { MdLocalPharmacy } from 'react-icons/md'


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
    permission: 'ACCESS_CLIENTS'
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
    href: "/dashboard/pharmacy",
    icon: <MdLocalPharmacy className="text-2xl" />,
  },
];



export const dashboardData = [
  {
    label: 'Projects',
    number: 12,
    // icon: <HomeIcon className="w-6 h-8" />
  },
  {
    label: 'Clients',
    number: 44,
    // icon: <HomeIcon className="w-6 h-8" />
  },
  {
    label: 'Tasks',
    number: 37,
    // icon: <HomeIcon className="w-6 h-8" />
  },
  {
    label: 'Employees',
    number: 218,
    // icon: <HomeIcon className="w-6 h-8" />
  }
]