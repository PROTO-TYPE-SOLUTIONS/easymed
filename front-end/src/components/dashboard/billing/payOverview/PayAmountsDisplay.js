import React from 'react'
import MpesaPayModal from './MpesaPayModal'

const PayAmountsDisplay = (
    {    
        appointmentCashSum,
        prescribedDrugsCashSum,
        labReqCashSum,
        appointmentInsuranceSum,
        prescribedDrugsInsuranceSum,
        labReqInsuranceSum,
        appointmentSum,
        prescribedDrugsSum,
        labReqSum,
    }

    ) => {
  return (
    <div className='space-y-2 w-full'>

            <div className='flex justify-end'>
                <div className='border-b border-[#D3D3D3] w-48 justify-between flex'>
                    <h2 className='border-b border-[#D3D3D3] w-full '>Cash</h2>
                    <h2 className='border-b border-[#D3D3D3] w-24 '>{appointmentCashSum + prescribedDrugsCashSum + labReqCashSum}</h2>
                </div>
            </div>

            <div className='flex justify-end'>
                <div className='border-b border-[#D3D3D3] w-48 justify-between flex'>
                    <h2 className='border-b border-[#D3D3D3] w-full '>Insurance</h2>
                    <h2 className='border-b border-[#D3D3D3] w-24 '>{appointmentInsuranceSum + prescribedDrugsInsuranceSum + labReqInsuranceSum}</h2>
                </div>
            </div>
            <div className='flex justify-end'>
                <div className='border-b border-[#D3D3D3] w-48 justify-between flex'>
                    <h2 className='border-b border-[#D3D3D3] w-full '>Total</h2>
                    <h2 className='border-b border-[#D3D3D3] w-24 '>{appointmentSum + prescribedDrugsSum + labReqSum}</h2>
                </div>
            </div>
    </div>
  )
}

export default PayAmountsDisplay