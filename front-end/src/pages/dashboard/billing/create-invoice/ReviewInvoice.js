import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import { MdLocalPrintshop } from 'react-icons/md'
import { billingInvoiceItems, billingInvoices } from '@/redux/service/billing'
import { getAllInvoiceItemsByInvoiceId, getAllInvoices } from '@/redux/features/billing';
import { useAuth } from '@/assets/hooks/use-auth'
import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
import * as Yup from "yup";
import BillingViewSelectedPrescribedDrugs from '@/components/dashboard/billing/payOverview/BillingViewSelectedPrescribedDrugs';
import BillingViewSelectedLabtests from '@/components/dashboard/billing/payOverview/BillingViewSelectedLabtests';
import BillingViewSelectedAppointments from '@/components/dashboard/billing/payOverview/BillingViewSelectedAppointments';
import FormButton from '@/components/common/button/FormButton';
import PayAmountsDisplay from '@/components/dashboard/billing/payOverview/PayAmountsDisplay';
import { getAllLabTestProfiles } from '@/redux/features/laboratory';
import { Container, Grid } from '@mui/material';
import InvoiceItems from './InvoiceItems';

const ReviewInvoice = ({ 
    selectedOption,
    selectedPatient,
    selectedInvoice,
    selectedAppointments, 
    selectedLabRequests, 
    selectedPrescribedDrugs, 
    setSelectedPrescribedDrugs,
    setSelectedLabRequests,
    setSelectedAppointments
    }) => 
    
    {
    const [loading, setLoading] = useState(false)
    const { invoiceItems } = useSelector((store)=> store.billing)

    const [appointmentSum, setAppointmentSum] = useState(0);
    const [appointmentMpesaSum, setAppointmentMpesaSum] = useState(0);
    const [appointmentInsuranceSum, setAppointmentInsuranceSum] = useState(0);
    const [appointmentCashSum, setAppointmentCashSum] = useState(0);

    const [prescribedDrugsSum, setPrescribedDrugsSum] = useState(0);
    const [prescribedDrugsMpesaSum, setPrescribedDrugsMpesaSum] = useState(0);
    const [prescribedDrugsInsuranceSum, setPrescribedDrugsInsuranceSum] = useState(0);
    const [prescribedDrugsCashSum, setPrescribedDrugsCashSum] = useState(0);


    const [labReqSum, setLabReqSum] = useState(0);
    const [labReqMpesaSum, setLabReqMpesaSum] = useState(0);
    const [labReqInsuranceSum, setLabReqInsuranceSum] = useState(0);
    const [labReqCashSum, setLabReqCashSum] = useState(0);


    const { invoices } = useSelector((store) => store.billing);
    const { labTestProfiles } = useSelector((store) => store.laboratory);
    const auth = useAuth()
    const invoiceRef = useRef();
    const router = useRouter();
    const dispatch = useDispatch();

    const payMethods = {
        "mpesa": 1,
        "cash":2,
        "insurance":3
    }

    const validationSchema = Yup.object().shape({
        invoice_description: Yup.string().required("This field is required!"),
      });

    function sumArray(array) {
        return array.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue;
        }, 0);
      }

    const totalAppointmentSum = () => {
        let totalFees = []
        let cashFees = []
        let mpesaFees = []
        let insuranceFees = []
        selectedAppointments.forEach((item)=>{
            totalFees.push(parseInt(item.sale_price))
            if(item.payMethod === "mpesa"){
                mpesaFees.push(item.sale_price)
            }else if(item.payMethod === "insurance"){
                insuranceFees.push(item.sale_price)
            }else{
                cashFees.push(item.sale_price)
            }
        })

        setAppointmentSum(sumArray(totalFees));
        setAppointmentMpesaSum(sumArray(mpesaFees));
        setAppointmentInsuranceSum(sumArray(insuranceFees));
        setAppointmentCashSum(sumArray(cashFees));

    }

    const totalPrescribedDrugsSum = () => {
        let totalFees = []
        let cashFees = []
        let mpesaFees = []
        let insuranceFees = []

        selectedPrescribedDrugs.forEach((item)=>{
            totalFees.push(parseInt(item.sale_price))
            if(item.payMethod === "mpesa"){
                mpesaFees.push(item.sale_price)
            }else if(item.payMethod === "insurance"){
                insuranceFees.push(item.sale_price)
            }else{
                cashFees.push(item.sale_price)
            }
        })

        setPrescribedDrugsSum(sumArray(totalFees));
        setPrescribedDrugsMpesaSum(sumArray(mpesaFees));
        setPrescribedDrugsInsuranceSum(sumArray(insuranceFees));
        setPrescribedDrugsCashSum(sumArray(cashFees));

    }

    const totalLabReqSum = () => {
        let totalFees = []
        let cashFees = []
        let mpesaFees = []
        let insuranceFees = []        
        selectedLabRequests.forEach((item)=>{
            totalFees.push(parseInt(item.sale_price))
            if(item.payMethod === "mpesa"){
                mpesaFees.push(item.sale_price)
            }else if(item.payMethod === "insurance"){
                insuranceFees.push(item.sale_price)
            }else{
                cashFees.push(item.sale_price)
            }
        })

        setLabReqSum(sumArray(totalFees));
        setLabReqMpesaSum(sumArray(mpesaFees));
        setLabReqInsuranceSum(sumArray(insuranceFees));
        setLabReqCashSum(sumArray(cashFees));

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

    const saveEachAppointmentInvoiceItem = (savedInvoice) => {
        selectedAppointments.forEach((appointment)=>{
            console.log("THESE ARE THE APPOINTMENTS",appointment)
            const payloadInvoiceItemData = {
                item_name: appointment.item_name,
                payment_mode:appointment.payMethod ? payMethods[appointment.payMethod] : 2,
                item_price: appointment.sale_price,
                invoice: savedInvoice.id,
                item: parseInt(appointment.item)
            }
            console.log("THESE ARE APPOINTMENTS INVOICE ITEMS",appointment)
            saveInvoiceItem(payloadInvoiceItemData);

        })

    }

    const saveEachLabReqInvoiceItem = (savedInvoice) => {
        selectedLabRequests.forEach((labREq)=>{
            const item_ID = labTestProfiles.find((profile)=> profile.id === labREq.test_profile)

            if(item_ID){

                const payloadInvoiceItemData = {
                    item_name: labREq.test_profile_name,
                    payment_mode:labREq.payMethod ? payMethods[labREq.payMethod] : 2,
                    item_price: labREq.sale_price,
                    invoice: savedInvoice.id,
                    item: parseInt(item_ID.item)
                }
                saveInvoiceItem(payloadInvoiceItemData);

            }else(
                toast.error("Item not Found")
            )
        })

    }

    const saveEachPrescribedDrugInvoiceItem = (savedInvoice) => {
        selectedPrescribedDrugs.forEach((drug)=>{
            const payloadInvoiceItemData = {
                item_name: drug.item_name,
                payment_mode:drug.payMethod ? payMethods[drug.payMethod] : 2,
                item_price: drug.sale_price,
                invoice: savedInvoice.id,
                item: parseInt(drug.item)
            }
            console.log("THESE ARE DURG INVOICE ITEMS",drug)
            saveInvoiceItem(payloadInvoiceItemData);

        })

    }

    const saveEachInvoiceItem = (savedInvoice) => {
        saveEachAppointmentInvoiceItem(savedInvoice);
        saveEachLabReqInvoiceItem(savedInvoice);
        saveEachPrescribedDrugInvoiceItem(savedInvoice);
    } 

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
            saveEachInvoiceItem(response);
            toast.success("invoice saved successfully");
            setLoading(false);
            router.push('/dashboard/billing');

        }catch(e){
            toast.error(e);
            setLoading(false);
            console.log("ERROR SAVING INVOICE", e)
        }
    }



  return (
    <Formik
        initialValues={{ invoice_description: '', status:"pending" }}
        validationSchema={validationSchema}
        onSubmit={saveInvoice}
    >
        <Form ref={invoiceRef} className="py-4 bg-white_light rounded-lg space-y-4 px-2 min-h-full flex flex-col justify-between">
            {selectedOption && 
            <>
            <div ref={invoiceRef} className='space-y-8'>
            <div className='flex justify-between items-center'>
                <div>
                    <p className='text-2xl'> {selectedOption?.label} </p>
                    {/* <p className='text-lg text-center'>{`Invoice Number: ${invoices.length + 1}`}</p> */}
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
            {InvoiceItems.length > 0 && (
                <InvoiceItems selectedPatient={selectedPatient} items={invoiceItems} />
            )}
            </div>

            <section className='mt-auto space-y-4 bottom-0'>
                <PayAmountsDisplay 
                    appointmentMpesaSum={appointmentMpesaSum}
                    prescribedDrugsMpesaSum={prescribedDrugsMpesaSum}
                    labReqMpesaSum={labReqMpesaSum}
                    appointmentCashSum={appointmentCashSum}
                    prescribedDrugsCashSum={prescribedDrugsCashSum}
                    labReqCashSum={labReqCashSum}
                    appointmentInsuranceSum={appointmentInsuranceSum}
                    prescribedDrugsInsuranceSum={prescribedDrugsInsuranceSum}
                    labReqInsuranceSum={labReqInsuranceSum}
                    appointmentSum={appointmentSum}
                    prescribedDrugsSum={prescribedDrugsSum}
                    labReqSum={labReqSum}
                    patient_id={selectedOption.value}
                />

                <section className="flex items-center justify-end gap-2">
                <FormButton loading={loading} label={"Save Invoice"}/>
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