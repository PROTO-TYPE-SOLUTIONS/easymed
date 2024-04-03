import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Grid } from '@mui/material';
import dynamic from "next/dynamic";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Column, Paging, Pager } from "devextreme-react/data-grid";
import CmtDropdownMenu from '@/assets/DropdownMenu';
import { LuMoreHorizontal } from 'react-icons/lu';
import { SlMinus } from 'react-icons/sl';

import { useAuth } from '@/assets/hooks/use-auth';
import LabItemModal from './LabItemModal';

import { removeItemToLabResultsItems, clearItemsToLabResultsItems, getAllLabRequests, getAllLabTestPanelsByTestRequest } from '@/redux/features/laboratory';
import SeachableSelect from '@/components/select/Searchable';
import { sendLabResults, addTestResultPanel, sendLabResultQualitative, addQualitativeTestResultPanel } from '@/redux/service/laboratory';

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
    {
      action: "add-result",
      label: "Add Results",
      icon: <SlMinus className="text-success text-xl mx-2" />,
    },
  ];
  
  return actions;
};

const AddTestResults = () => {

  const router = useRouter()
  const userActions = getActions();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelectedItem] = useState(null)
  const [selectedOption, setSelectedOPtion] = useState(null)
  const dispatch = useDispatch();
  const { labResultItems  } = useSelector((store) => store.laboratory);
  const { labTestPanels  } = useSelector((store) => store.laboratory);
  const auth = useAuth();
  const { labRequests } = useSelector((store) => store.laboratory);

  const token = useAuth();
  const initialValues = {
    title: "",
    lab_test_request: null,
    qualitative: null    
  };


  useEffect(() => {
    if (token) {
      dispatch(getAllLabRequests(token));
      if(selected){
        dispatch(getAllLabTestPanelsByTestRequest(selected.value, token));
      }
    }
  }, [token, selected]);
  
  const validationSchema = Yup.object().shape({
    lab_test_request: Yup.object().required("This field is required!"),
    qualitative: Yup.object().required("This field is required!"),
    title: Yup.string().required("This field is required!"),
  });

  const onMenuClick = async (menu, data) => {
    console.log(data)
    if (menu.action === "remove") {
      dispatch(removeItemToLabResultsItems(data))
    }else if(menu.action === "add-result"){
      setOpen(true);
      setSelectedOPtion(data)
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

  const saveLabResultsItem = async (item, payload) => {

    const payloadData = {
      ...item,
      lab_test_result: payload.id
    }

    console.log("PAYLOAD LAB RESULTS" , payloadData)

    try {
      await addTestResultPanel(payloadData, auth).then(()=>{
        toast.success("Test REsult Item Added Successfully!");
      })

    } catch(err) {
      toast.error(err);
      setLoading(false);
    } 
  }

  const saveQualitativeLabResultsItem = async (item, payload) => {
    const payloadData = {
      ...item,
      lab_test_result: payload.id
    }

    console.log("QUALITATIVE PAYLOAD LAB RESULTS" , payloadData)

    try {
      await addQualitativeTestResultPanel(payloadData, auth).then(()=>{
        toast.success("Qualitative Test REsult Item Added Successfully!");
      })

    } catch(err) {
      toast.error(err);
      setLoading(false);
    } 
  }

  const sendEachItemToDb = (payload, formValue) => {
    if(formValue.qualitative.value === "qualitative"){

      labResultItems.forEach(item => saveQualitativeLabResultsItem(item, payload));

    }else{
      labResultItems.forEach(item => saveLabResultsItem(item, payload));
    }
  }

  const saveLabResults = async (formValue, helpers) => {
    console.log(formValue)

    try {
      if (labResultItems.length <= 0) {
        toast.error("No lab result items");
        return;
      }      
    
      setLoading(true);

      // save from here if qualitative
      if(formValue.qualitative.value === "qualitative"){

        const payload = {
          ...formValue,
          lab_test_request: formValue.lab_test_request.value,
          category: formValue.qualitative.value
        }

        await sendLabResultQualitative(payload, auth).then((res)=> {
          console.log(res)
          sendEachItemToDb(res, formValue)
          toast.success("Result Added Successfully!");
          setLoading(false);
          dispatch(clearItemsToLabResultsItems());
          
          router.push('/dashboard/laboratory');
        })

      }else{

        const payload = {
          ...formValue,
          lab_test_request: formValue.lab_test_request.value
        }
  
        console.log(payload);
      
        await sendLabResults(payload, auth).then((res) => {
          console.log(res)
          sendEachItemToDb(res, formValue)
          toast.success("Result Added Successfully!");
          setLoading(false);
          dispatch(clearItemsToLabResultsItems());
          
          router.push('/dashboard/laboratory');
        });

      }
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex gap-4 mb-8 items-center">
          <img onClick={() => router.back()} className="h-3 w-3 cursor-pointer" src="/images/svgs/back_arrow.svg" alt="go back"/>
          <h3 className="text-xl"> Lab Result entry </h3>
      </div>
      <div className='flex justify-end'>
        <LabItemModal open={open} setOpen={setOpen} selected={selectedOption}/>
      </div>     

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={saveLabResults}
      >
      <Form className="">
      <Grid container spacing={2} className='my-2 flex items-center'>
        <Grid item md={4} xs={4}>
          <SeachableSelect
            label="test request ( sample id )"
            name="lab_test_request"
            setSelectedItem={setSelectedItem}
            options={labRequests.map((labRequests) => ({ value: labRequests.id, label: `${labRequests?.sample}` }))}
            onChange={(selectedOption) => {
              console.log("VALUE CHANGED");
              console.log("Selected option:", selectedOption);
            }}
          />
          <ErrorMessage
            name="lab_test_request"
            component="div"
            className="text-warning text-xs"
          />  
        </Grid>
        <Grid item md={4} xs={4}>
          <SeachableSelect
            label="Is Qualitative"
            name="qualitative"
            options={[{value: 'qualitative', label: "Qualitative"}, {value: "qauntitative", label: "Quantitative"}].map((item) => ({ value: item.value, label: `${item?.label}` }))}
          />
          <ErrorMessage
            name="qualitative"
            component="div"
            className="text-warning text-xs"
          />      
        </Grid>
        <Grid item md={4} xs={4}>
          <label>result title</label>
          <Field
            className="block border rounded-lg text-sm border-gray py-2 px-4 focus:outline-card w-full"
            maxWidth="sm"
            placeholder="Test Result Title"
            name="title"
          />
          <ErrorMessage
            name="title"
            component="div"
            className="text-warning text-xs"
          />
        </Grid>
      </Grid>
      <DataGrid
        dataSource={labResultItems}
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
          dataField="test_panel"
          caption="Test Panel" 
          cellRender={(cellData) => {
            const testPanel = labTestPanels.find(item => item.id === cellData.data.test_panel);
            return testPanel ? `${testPanel.name}` : 'null';
          }}
        />
        <Column 
          dataField="result" 
          caption="Result" 
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
            Save Lab Result
          </button>
        </div>
      </Grid>

      </Form>
      </Formik>
    </section>
  )
}

export default AddTestResults