import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router';

const LabNav = () => {
    const router = useRouter();
    const pathName = router.pathname
  return (
    <div className="flex items-center gap-8 my-4">
        <Link href='/dashboard/laboratory' className={`${ pathName === '/dashboard/laboratory'  ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
            Lab Results
        </Link>
        <Link href="/dashboard/laboratory/lab-requests" className={`${ pathName === "/dashboard/laboratory/lab-requests"  ? 'bg-primary text-white' : 'bg-white shadow'}  text-sm rounded px-3 py-2 mb-1`}>
            Lab Requests
        </Link>
  </div>
  )
}

export default LabNav