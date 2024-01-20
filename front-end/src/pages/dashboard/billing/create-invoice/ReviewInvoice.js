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
    const [appointmentSum, setAppointmentSum] = useState(0);
    const [prescribedDrugsSum, setPrescribedDrugsSum] = useState(0);
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
            fees.push(parseInt(item.fee))
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

    const saveEachInvoiceItem = () => {
        selectedAppointments.forEach((appointment)=>{
            console.log(appointment)
            const payloadInvoiceItemData = {
                item_name: appointment.date_created,
                item_price: appointment.fee,
                invoice: invoices.length + 1,
                service: 1
            }
            saveInvoiceItem(payloadInvoiceItemData);

        })
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
            invoice_amount: appointmentSum,
            status: "pending",
            invoice_number: invoices.length + 1
            // invoice_file: "string"
          }

          console.log(payloadData)

        try {
            if (selectedAppointments.length <= 0 && selectedLabRequests <= 0 && selectedPrescribedDrugs <= 0) {
                toast.error("Select atleast one item");
                return;
            }

            const response = await billingInvoices(auth, payloadData)
            console.log(response)
            saveEachInvoiceItem()
            toast.success("invoice saved successfully")
            router.push('/dashboard/billing')

        }catch(e){
            toast.error(e);
            console.log("ERROR SAVING INVOICE", e)
        }
    }

    useEffect(()=>{
        if(auth){
            totalAppointmentSum()
            totalPrescribedDrugsSum()
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
                                <span>{`ksh ${appointment.fee}`}</span>
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
                                <span>{testReq.name}</span> 
                                {/* <span>{`ksh ${appointment.fee}`}</span> */}
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
                        <h2 className='border-b w-24 '>{appointmentSum + prescribedDrugsSum}</h2>
                    </div>
                </div>
                <div className='flex justify-end'>
                    <div className='border-b w-48 justify-between flex'>
                        <h2 className='border-b w-full '>Payable</h2>
                        <h2 className='border-b w-24 '>{appointmentSum + prescribedDrugsSum}</h2>
                    </div>
                </div>
            </div>

            <section className="flex items-center justify-end gap-2">
            <button type='submit' className="bg-primary text-white px-3 py-2 text-xs rounded-xl">
                Save Invoice
            </button>
            <button className="border border-primary flex items-center gap-2 px-3 py-2 text-xs rounded-xl">
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