import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@/assets/hooks/use-auth";
import { getPaymentModes } from "@/redux/features/billing";
import CategorizedItems from "./CategorizedItems";

const { Container, Grid } = require("@mui/material");

const InvoiceItems = ({ 
    items, selectedPatient, selectedInvoice,
    totalLabReqSum,
    totalAppointmentSum,
    totalPrescribedDrugsSum,
    setLabReqSum,
    setLabReqCashSum,
    setLabReqInsuranceSum,
    setAppointmentSum,
    setAppointmentCashSum,
    setAppointmentInsuranceSum,
    setPrescribedDrugsSum,
    setPrescribedDrugsCashSum,
    setPrescribedDrugsInsuranceSum,
    }) => {
    const authUser = useAuth()
    const dispatch = useDispatch()
    const { paymodes, } = useSelector(({ billing }) => billing);

    const patient_insurance = paymodes.filter((mode) => 
      mode.insurance === null || selectedPatient.insurances.some(insurance => insurance.id === mode.insurance)
    );

    useEffect(() => {
        if (authUser) {
          dispatch(getPaymentModes(authUser));
        }
      }, [authUser]);

    const groupedItems = items?.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    const resetTotals = ()=> {
        setPrescribedDrugsSum(0)
        setPrescribedDrugsCashSum(0)
        setPrescribedDrugsInsuranceSum(0)
        setLabReqSum(0)
        setLabReqCashSum(0)
        setLabReqInsuranceSum(0)
        setAppointmentSum(0)
        setAppointmentCashSum(0)
        setAppointmentInsuranceSum(0)
    }

    useEffect(() => {
        resetTotals();
        if (groupedItems) {
            Object.keys(groupedItems).forEach((category) => {
                if (category.toLowerCase().includes("appointment")) {
                    totalAppointmentSum(groupedItems[category]);
                } else if (category === "Lab Test") {
                    totalLabReqSum(groupedItems[category]);
                } else if (category === "Drug") {
                    totalPrescribedDrugsSum(groupedItems[category]);
                }
            });
        }
    }, [items, selectedInvoice]);

    return (
        <div>
            {groupedItems && (
                Object.keys(groupedItems)?.map(category => (
                    <section key={category} className='py-2'>
                        <Grid className='flex items-center py-1' container spacing={2}>
                            <Grid item md={3} xs={3}>
                                <h2 className='font-bold text-primary'>{category}</h2>
                            </Grid>
                            <Grid item xs={4}>
                                <h2 className='font-bold text-primary'>{'Payment Mode'}</h2>
                            </Grid>
                            <Grid className='px-2 flex justify-end' item xs={2}>
                                <h2 className='font-bold text-primary'>{'Actual Total'}</h2>
                            </Grid>
                            <Grid className='px-2 flex justify-end' item xs={2}>
                                <h2 className='font-bold text-primary'>{'Item Amount'}</h2>
                            </Grid>
                            <Grid item xs={1}>
                            </Grid>
                        </Grid>
                        <section>
                            {groupedItems[category].map(item => (
                                <CategorizedItems 
                                    key={item.id} 
                                    invoiceItem={item} 
                                    patient_insurance={patient_insurance}
                                    setLabReqSum={setLabReqSum}
                                    setLabReqCashSum={setLabReqCashSum}
                                    setLabReqInsuranceSum={setLabReqInsuranceSum}
                                    setAppointmentSum={setAppointmentSum}
                                    setAppointmentCashSum={setAppointmentCashSum}
                                    setAppointmentInsuranceSum={setAppointmentInsuranceSum}
                                    setPrescribedDrugsSum={setPrescribedDrugsSum}
                                    setPrescribedDrugsCashSum={setPrescribedDrugsCashSum}
                                    setPrescribedDrugsInsuranceSum={setPrescribedDrugsInsuranceSum}
                                />
                            ))}
                        </section>
                    </section>
                ))
            ) }
        </div>
    );
};

export default InvoiceItems;