import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MdLocalPrintshop } from 'react-icons/md'
import { billingInvoiceItems, billingInvoices } from '@/redux/service/billing'
import { getAllInvoices } from '@/redux/features/billing';
import { useAuth } from '@/assets/hooks/use-auth'
import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
import * as Yup from "yup";

const ReviewInvoice = ({ selectedOption, selectedAppointments, selectedLabRequests, selectedPrescribedDrugs, }) => {
    const [loading, setLoading] = useState(false)
    const [appointmentSum, setAppointmentSum] = useState(0);
    const [prescribedDrugsSum, setPrescribedDrugsSum] = useState(0);
    const [labReqSum, setLabReqSum] = useState(0);
    const { invoices } = useSelector((store) => store.billing);
    const auth = useAuth()
    const invoiceRef = useRef();
    const router = useRouter();
    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        invoice_description: Yup.string().required("This field is required!"),
      });

    function sumArray(array) {
        return array.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0);
      }

    const totalAppointmentSum = () => {
        let fees = []
        selectedAppointments.forEach((item)=>{
            fees.push(parseInt(item.sale_price))
        })

        setAppointmentSum(sumArray(fees))

    }

    const totalPrescribedDrugsSum = () => {
        let fees = []
        selectedPrescribedDrugs.forEach((item)=>{
            fees.push(parseInt(item.sale_price))
        })

        setPrescribedDrugsSum(sumArray(fees))

    }

    const totalLabReqSum = () => {
        let fees = []
        selectedLabRequests.forEach((item)=>{
            fees.push(parseInt(item.sale_price))
        })

        setLabReqSum(sumArray(fees))

    }

    const saveInvoiceItem = async (payloadInvoiceItemData) => {
        console.log('INVOICE ITEM PAYLOAD', payloadInvoiceItemData)
        try {
            const response = await billingInvoiceItems(auth, payloadInvoiceItemData)
            console.log(response)
            toast.success('invoice item saved suucessfully')

        }catch(e){
            toast.error(e)
        }

    }

    // SERVICE ID SHOULD BE CHANGED

    const saveEachAppointmentInvoiceItem = () => {
        selectedAppointments.forEach((appointment)=>{
            console.log("THESE ARE THE APPOINTMENTS",appointment)
            const payloadInvoiceItemData = {
                item_name: appointment.item_name,
                item_price: appointment.sale_price,
                invoice: invoices.length + 1,
                item: parseInt(appointment.item)
            }
            saveInvoiceItem(payloadInvoiceItemData);

        })

    }

    // SERVICE ID SHOULD BE CHANGED

    const saveEachLabReqInvoiceItem = () => {
        selectedLabRequests.forEach((labREq)=>{
            console.log(labREq)
            const payloadInvoiceItemData = {
                item_name: labREq.test_profile_name,
                item_price: labREq.sale_price,
                invoice: invoices.length + 1,
                item: parseInt(labREq.item)
            }
            saveInvoiceItem(payloadInvoiceItemData);

        })

    }

    // SERVICE ID SHOULD BE CHANGED

    const saveEachPrescribedDrugInvoiceItem = () => {
        selectedPrescribedDrugs.forEach((drug)=>{
            console.log(drug)
            const payloadInvoiceItemData = {
                item_name: drug.item_name,
                item_price: drug.sale_price,
                invoice: invoices.length + 1,
                item: parseInt(drug.item)
            }
            saveInvoiceItem(payloadInvoiceItemData);

        })

    }

    const saveEachInvoiceItem = () => {
        saveEachAppointmentInvoiceItem();
        saveEachLabReqInvoiceItem();
        saveEachPrescribedDrugInvoiceItem();
    } 

    const generatePdf = () => {
        return new Promise((resolve) => {
          const input = invoiceRef.current;  
          console.log(input)
        //   const table = input.children[2].children[0].children[5];
          const pdfWidth = 210; 
          const pdfHeight = 297;
          const scale = 1; 
      
          html2canvas(input, { scale: scale }).then((canvas) => {
            const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
      
            const imgWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      
            resolve(pdf);
          });
        });
    };

    const saveInvoice = async (formValue) => {
        
        const payloadData = {
            ...formValue,
            invoice_date: "2024-01-16",
            invoice_amount: appointmentSum + prescribedDrugsSum + labReqSum,
            status: "pending",
            invoice_number: invoices.length + 1,
            patient:selectedOption?.value
            // invoice_file: "string"
          }

          console.log("SAVE INVOICE PAYLOAD",payloadData)

        try {
            setLoading(true)
            if (selectedAppointments.length <= 0 && selectedLabRequests <= 0 && selectedPrescribedDrugs <= 0) {
                toast.error("Select atleast one item");
                setLoading(false);
                return;
            }

            const response = await billingInvoices(auth, payloadData)
            console.log(response)
            saveEachInvoiceItem();
            toast.success("invoice saved successfully");
            setLoading(false);
            router.push('/dashboard/billing');

        }catch(e){
            toast.error(e);
            setLoading(false);
            console.log("ERROR SAVING INVOICE", e)
        }
    }

    useEffect(()=>{
        if(auth){
            totalAppointmentSum();
            totalPrescribedDrugsSum();
            totalLabReqSum();
            dispatch(getAllInvoices(auth));
        }
    },[selectedOption, selectedAppointments, selectedLabRequests, selectedPrescribedDrugs, auth])

  return (
    <Formik
        initialValues={{ invoice_description: '', }}
        validationSchema={validationSchema}
        onSubmit={saveInvoice}
    >
        <Form ref={invoiceRef} className="py-10 space-y-4 px-4 min-h-full flex flex-col justify-between">
            {selectedOption && 
            <>
            <div ref={invoiceRef} className='space-y-8'>
            <div className='flex justify-between items-center'>
                <div>
                    <p className='text-2xl'> {selectedOption?.label} </p>
                    <p className='text-lg text-center'>{`Invoice Number: ${invoices.length + 1}`}</p>
                </div>
                <div>
                <Field
                    as="textarea"
                    className="bg-white rounded-lg text-sm p-2 px-4 focus:outline-none w-full"
                    maxWidth="sm"
                    placeholder="Enter invoice description"
                    name="invoice_description"
                />
                <ErrorMessage
                    name="invoice_description"
                    component="div"
                    className="text-warning text-xs"
                />
                </div>
            </div>
            {selectedAppointments.length > 0 && (
                <div className='space-y-2'>
                    <h2 className='text-primary'> Appointments </h2>
                    <ul className='space-y-2'>
                        {selectedAppointments.map(appointment=> (
                            <li className='flex justify-between text-xs' key={appointment.id}> 
                                <span>{appointment.item_name}</span> 
                                <span>{`ksh ${appointment.sale_price}`}</span>
                            </li>
                            )
                        )}
                    </ul>
                </div>
            )}
            {selectedLabRequests.length > 0 && (
                <div className='space-y-2'>
                    <h2 className='text-primary'> Lab Test Requests </h2>
                    <ul className='space-y-2'>
                        {selectedLabRequests.map(testReq=> (
                            <li className='flex justify-between text-xs' key={testReq.id}>
                                <span>{testReq.test_profile_name}</span> 
                                <span>{`ksh ${testReq.sale_price}`}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {selectedPrescribedDrugs.length > 0 && (
                <div className='space-y-2'>
                    <h2 className='text-primary'> Prescribed Drugs </h2>
                    <ul className='space-y-2'>
                        {selectedPrescribedDrugs.map(drug=> (
                            <li className='flex justify-between text-xs' key={drug.id}>
                                <span>{drug.item_name}</span> 
                                <span>{`ksh ${drug.sale_price}`}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            </div>

            <section className='mt-auto space-y-4 bottom-0'>
            <div className='space-y-2'>
                <div className='flex justify-end'>
                    <div className='border-b w-48 justify-between flex'>
                        <h2 className='border-b w-full '>Total</h2>
                        <h2 className='border-b w-24 '>{appointmentSum + prescribedDrugsSum + labReqSum}</h2>
                    </div>
                </div>
                <div className='flex justify-end'>
                    <div className='border-b w-48 justify-between flex'>
                        <h2 className='border-b w-full '>Payable</h2>
                        <h2 className='border-b w-24 '>{appointmentSum + prescribedDrugsSum + labReqSum}</h2>
                    </div>
                </div>
            </div>

            <section className="flex items-center justify-end gap-2">
            <button type='submit' className="bg-primary text-white px-3 py-2 text-xs rounded-xl">
                {loading && (
                <svg
                    aria-hidden="true"
                    role="status"
                    class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                    ></path>
                    <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#1C64F2"
                    ></path>
                </svg>
                )}
                Save Invoice
            </button>
            <button onClick={()=>console.log("printed")} className="border border-primary flex items-center gap-2 px-3 py-2 text-xs rounded-xl">
                <MdLocalPrintshop />
                Print Invoice
            </button>
            </section>
            </section>
            </>}
        </Form>
    </Formik>
  )
}

export default ReviewInvoice