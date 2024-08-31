import React from 'react'
import MpesaPayModal from './MpesaPayModal'

const PayAmountsDisplay = (
    {    
        appointmentMpesaSum,
        prescribedDrugsMpesaSum,
        labReqMpesaSum,
        appointmentCashSum,
        prescribedDrugsCashSum,
        labReqCashSum,
        appointmentInsuranceSum,
        prescribedDrugsInsuranceSum,
        labReqInsuranceSum,
        appointmentSum,
        prescribedDrugsSum,
        labReqSum,
        patient_id,
    }

    ) => {
  return (
    <div className='space-y-2 w-full'>

            <div className='flex justify-end'>
                <div className='border-b border-[#D3D3D3] w-48 justify-between flex items-center'>
                    <h2 className='w-full '>Mpesa</h2>
                    <h2 className='w-24 '>{appointmentMpesaSum + prescribedDrugsMpesaSum + labReqMpesaSum}</h2>
                    {(appointmentMpesaSum + prescribedDrugsMpesaSum + labReqMpesaSum) > 0 && (
                        <MpesaPayModal patient_id={patient_id} amount={(appointmentMpesaSum + prescribedDrugsMpesaSum + labReqMpesaSum)}/>
                    )}
                </div>
            </div>
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