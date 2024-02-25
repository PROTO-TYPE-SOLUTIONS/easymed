import React from 'react'

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
    }

    ) => {
  return (
    <div className='space-y-2'>
        <div className='flex justify-between gap-4'>

            <div className='flex justify-end'>
                <div className='border-b w-48 justify-between flex'>
                    <h2 className='border-b w-full '>Mpesa</h2>
                    <h2 className='border-b w-24 '>{appointmentMpesaSum + prescribedDrugsMpesaSum + labReqMpesaSum}</h2>
                </div>
            </div>
            <div className='flex justify-end'>
                <div className='border-b w-48 justify-between flex'>
                    <h2 className='border-b w-full '>Cash</h2>
                    <h2 className='border-b w-24 '>{appointmentCashSum + prescribedDrugsCashSum + labReqCashSum}</h2>
                </div>
            </div>
        </div>

        <div className='flex justify-between gap-4'>
            <div className='flex justify-end'>
                <div className='border-b w-48 justify-between flex'>
                    <h2 className='border-b w-full '>Insurance</h2>
                    <h2 className='border-b w-24 '>{appointmentInsuranceSum + prescribedDrugsInsuranceSum + labReqInsuranceSum}</h2>
                </div>
            </div>
            <div className='flex justify-end'>
                <div className='border-b w-48 justify-between flex'>
                    <h2 className='border-b w-full '>Total</h2>
                    <h2 className='border-b w-24 '>{appointmentSum + prescribedDrugsSum + labReqSum}</h2>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PayAmountsDisplay