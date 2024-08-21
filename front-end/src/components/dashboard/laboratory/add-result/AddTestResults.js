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

import { removeItemToLabResultsItems, clearItemsToLabResultsItems, getAllLabRequests, getAllLabTestPanelsByTestRequest, getAllPhlebotomySamples, getAllLabTestPanelsBySample } from '@/redux/features/laboratory';
import SeachableSelect from '@/components/select/Searchable';
import { sendLabResults, addTestResultPanel, sendLabResultQualitative, addQualitativeTestResultPanel, updateLabRequestPanels } from '@/redux/service/laboratory';

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
  const { labRequests, phlebotomySamples } = useSelector((store) => store.laboratory);

  const token = useAuth();
  const initialValues = {
    title: "",
    lab_test_request: null,
    recorded_by:token.user_id,
  };

  useEffect(() => {
    if (token) {
      dispatch(getAllLabRequests(token));
      dispatch(getAllPhlebotomySamples(token))
      if(selected){
        dispatch(getAllLabTestPanelsBySample(selected.value, token));
      }
    }
  }, [token, selected]);
  
  const validationSchema = Yup.object().shape({
    lab_test_request: Yup.object().required("This field is required!"),
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

  const saveLabResults = async (formValue, helpers) => {
    console.log(formValue)

    try {
      if (labResultItems.length <= 0) {
        toast.error("No lab result items");
        return;
      }    
      setLoading(true);

      labResultItems.forEach(async(panel)=> {

          const payload = {
            id:panel.id,
            result: panel.result
          }
          const response = await updateLabRequestPanels(payload, auth)
                 
      })
      setLoading(false);
      router.back() 

      }catch(error){
        console.log("ERR SAVING RESULTS")
        setLoading(false);
      }
  }

  return (
    <section>
      <div className="flex gap-4 mb-8 items-center">
          <img onClick={() => router.back()} className="h-3 w-3 cursor-pointer" src="/images/svgs/back_arrow.svg" alt="go back"/>
          <h3 className="text-xl"> Lab Result entry </h3>
      </div>
      <div className='flex justify-end'>
      {selected && (<LabItemModal open={open} setOpen={setOpen} sample_label={selected.label} selected={selectedOption}/>)}
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={saveLabResults}
      >
        {({ values, setFieldValue }) => (
      <Form className="">
      <Grid container spacing={2} className='my-2 flex items-center'>
        <Grid item md={12} xs={12}>
          <SeachableSelect
            label="Sample"
            name="lab_test_request"
            setSelectedItem={(selectedOption) => {
              setSelectedItem(selectedOption);
            }}
            options={phlebotomySamples.filter((sample)=>sample.is_sample_collected === true).map((labRequests) => ({ value: labRequests.id, label: `${labRequests?.patient_sample_code}` }))}
          />
          <ErrorMessage
            name="lab_test_request"
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
      <Grid className='py-2' item md={4} xs={12}>
          <Field
            as='textarea'
            rows={4}
            className="block border rounded-lg text-sm border-gray py-2 px-4 focus:outline-card w-full"
            maxWidth="sm"
            placeholder="Comments"
            name="title"
          />
          <ErrorMessage
            name="title"
            component="div"
            className="text-warning text-xs"
          />
        </Grid>
      <Grid item md={12} xs={12}>
        <div className="flex py-2 items-center justify-end">
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

      </Form>)}
      </Formik>
    </section>
  )
}

export default AddTestResults