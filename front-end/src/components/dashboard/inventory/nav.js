import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const InventoryNav = () => {
  const router = useRouter();
  const pathName = router.pathname

  console.log(pathName === '/dashboard/inventory/add-purchase')
  return (
    <div className="flex items-center gap-8 my-8">
      <Link href='/dashboard/inventory' className={`${ pathName === '/dashboard/inventory' || pathName === '/dashboard/inventory/add-inventory'  ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
        Inventory
      </Link>
      <Link href='/dashboard/inventory/purchase-orders' className={`${pathName === '/dashboard/inventory/purchase-orders' || pathName === '/dashboard/inventory/add-purchase' ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
        Purchase Order
      </Link>
      <Link href='/dashboard/inventory/requisitions' className={`${pathName === '/dashboard/inventory/requisitions' || pathName === '/dashboard/inventory/create-requisition' ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
        Requisition Entry
      </Link>
      {/* <RequisitionModal /> */}
      <Link href='/dashboard/inventory/incoming-items' className={`${pathName === '/dashboard/inventory/incoming-items' ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
        Incoming Items
      </Link>
      <Link href='/dashboard/inventory/report' className={`${pathName === '/dashboard/inventory/report' ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
        Reports
      </Link>
    </div>
  )
}

export default InventoryNav