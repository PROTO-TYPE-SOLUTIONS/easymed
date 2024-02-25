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
    <div className='space-y-2'>
        <div className='flex justify-between gap-4'>

            <div className='flex justify-end'>
                <div className='border-b-2 w-48 justify-between flex items-center'>
                    <h2 className='w-full '>Mpesa</h2>
                    <h2 className='w-24 '>{appointmentMpesaSum + prescribedDrugsMpesaSum + labReqMpesaSum}</h2>
                    {(appointmentMpesaSum + prescribedDrugsMpesaSum + labReqMpesaSum) > 0 && (
                        <MpesaPayModal patient_id={patient_id} amount={(appointmentMpesaSum + prescribedDrugsMpesaSum + labReqMpesaSum)}/>
                    )}
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