import React, { useState, } from "react";
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, } from "formik";
import { useAuth } from "@/assets/hooks/use-auth";
import { useRouter } from 'next/navigation'
import dynamic from "next/dynamic";
import { Column, Pager } from "devextreme-react/data-grid";
import { Grid, Container } from "@mui/material";
import { createPrescription } from "@/redux/service/patients";
import { prescribeDrug } from "@/redux/service/patients";
import { clearAllPrescriptionItems } from "@/redux/features/patients";
import { removeAPrescriptionItem } from "@/redux/features/patients";
import { toast } from "react-toastify";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { SlMinus } from "react-icons/sl";
import { LuMoreHorizontal } from "react-icons/lu";
import DashboardLayout from '@/components/layout/dashboard-layout';
import PrescriptionItemDialog from "@/components/dashboard/doctor-interface/prescriptionItemDialog";
import ProtectedRoute from "@/assets/hoc/protected-route";
import AuthGuard from "@/assets/hoc/auth-guard";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const getActions = () => {
  let actions = [
    {
      action: "remove",
      label: "Remove",
      icon: <SlMinus className="text-success text-xl mx-2" />,
    },
  ];
  
  return actions;
};

const PrescribeDrug = () => {
  const params = useParams();
  const router = useRouter()
  const userActions = getActions();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { item, } = useSelector(({ inventory }) => inventory);
  const { prescriptionItems } = useSelector(({ patient }) => patient);
  const auth = useAuth();
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = String(currentDate.getMonth() + 1).padStart(2, '0');
  let day = String(currentDate.getDate()).padStart(2, '0');

  const initialValues = {
    status: "pending",
    start_date: `${year}-${month}-${day}`,
  };

  const onMenuClick = async (menu, data) => {
    console.log(data)
    if (menu.action === "remove") {
      dispatch(removeAPrescriptionItem(data))
    }
  };

  const actionsFunc = ({ data }) => {
    return (
      <>
        <CmtDropdownMenu
          sx={{ cursor: "pointer" }}
          items={userActions}
          onItemClick={(menu) => onMenuClick(menu, data)}
          TriggerComponent={
            <LuMoreHorizontal className="cursor-pointer text-xl" />
          }
        />
      </>
    );
  };


  const savePrescribedDrug = async (item, payload) => {

    const payloadData = {
      ...item,
      patient: parseInt(item.patient),
      prescription:payload.id
    }

    try {
      await prescribeDrug(payloadData).then(()=>{
        toast.success("Prescribed Drug Added Successfully!");
      })

    } catch(err) {
      toast.error(err);
      setLoading(false);
    } 
  }

  const sendEachPrescriptionItemToDb = (payload) => {
    prescriptionItems.forEach(item => savePrescribedDrug(item, payload))
  }

  const savePrescription = async (formValue, helpers) => {

    try {
      if (prescriptionItems.length <= 0) {
        toast.error("No prescribed drugs added");
        return;
      }      
    
      setLoading(true);
    
      const payload = {
        ...formValue,
        created_by: auth.user_id
      }

      console.log(payload)
    
      await createPrescription(payload).then((res) => {
        sendEachPrescriptionItemToDb(res)
        toast.success("Prescription Saved Successfully!");
        setLoading(false);
        dispatch(clearAllPrescriptionItems())
        
        router.push('/dashboard/doctor-interface')
      });
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };

  return (
    <Container className="mt-20">
      <section>
      <div className="flex gap-4 mb-8 items-center">
          <img onClick={() => router.back()} className="h-3 w-3 cursor-pointer" src="/images/svgs/back_arrow.svg" alt="go back"/>
          <h3 className="text-xl"> patient prescription </h3>
      </div>
      <div className="flex items-center justify-end">
          <PrescriptionItemDialog patient_id={params?.patient_id}/>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={savePrescription}
      >
      <Form className="">
      <DataGrid
        dataSource={prescriptionItems}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
        remoteOperations={true}
        showColumnLines={true}
        showRowLines={true}
        wordWrapEnabled={true}
        allowPaging={true}
        className="shadow-xl"
      >
        <Pager
          visible={false}
          showPageSizeSelector={true}
          showNavigationButtons={true}
        />
        <Column 
          dataField="item" 
          caption="Item Name" 
          cellRender={(cellData) => {
            const productItem = item.find(item => item.id === cellData.data.item);
            return productItem ? `${productItem.name}` : 'null';
          }}
        />
        <Column 
          dataField="dosage" 
          caption="Dosage" 
        />
        <Column 
          dataField="frequency" 
          caption="Frequency"       
        />
        <Column 
          dataField="duration" 
          caption="Duration"
        />
        <Column 
          dataField="note" 
          caption="Note"
        />
        <Column 
          dataField="" 
          caption=""
          cellRender={actionsFunc}
        />
      </DataGrid>

      <Grid className="mt-8" item md={12} xs={12}>
        <div className="flex items-center justify-start">
          <button
            type="submit"
            className="bg-primary rounded-xl text-sm px-8 py-4 text-white"
          >
            {loading && (
              <svg
                aria-hidden="true"
                role="status"
                className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
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
            Save Prescription
          </button>
        </div>
      </Grid>
      </Form>
      </Formik>
    </section>
    </Container>
  )
}

PrescribeDrug.getLayout = (page) => (
    <ProtectedRoute permission={'CAN_ACCESS_DOCTOR_DASHBOARD'}>
      <AuthGuard>
        <DashboardLayout>{page}</DashboardLayout>
      </AuthGuard>
    </ProtectedRoute>
  );

export default PrescribeDrug;