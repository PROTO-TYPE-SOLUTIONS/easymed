import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router';

const PhamarcyNav = () => {
    const router = useRouter();
    const pathName = router.pathname
  return (
    <div className="flex items-center gap-4 my-8">
        <Link href='/dashboard/phamarcy' className={`${pathName === '/dashboard/phamarcy' ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
            Phamarcy
        </Link>
        <Link href='/dashboard/phamarcy/create-invoice' className={`${pathName === '/dashboard/phamarcy/create-invoice' ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
            New Invoice
        </Link>
        {/* <RequisitionModal /> */}
        <Link href='/dashboard/phamarcy/create-requisition' className={`${pathName === '/dashboard/phamarcy/create-requisition' ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
            Create Requisition
        </Link>
    </div>
  )
}

export default PhamarcyNav;