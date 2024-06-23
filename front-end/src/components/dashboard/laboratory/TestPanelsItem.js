import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useAuth } from '@/assets/hooks/use-auth';
import { fetchLabTestPanelsBySpecificSample, updatePhlebotomySamples } from '@/redux/service/laboratory';
import SeachableSelect from '@/components/select/Searchable';
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import FormButton from '@/components/common/button/FormButton';
import { sendToEquipment } from "@/redux/service/laboratory";

const TestPanelsItem = ({sample, collected}) => {
  const auth = useAuth()
  const [loading, setLoading] = useState(false)
  const [resultItems, setResultItems]=useState([])
  const [status, setStatus]= useState(false)
  const { labTestPanels, labEquipments } = useSelector((store) => store.laboratory);

  const initialValues = {
    equipment: ""
  }


  const validationSchema = Yup.object().shape({
    equipment: Yup.object().required("This field is required!"),
  });

  const getTestPanelsBySampleId = async (sample, auth)=> {
    try {
      const response = await fetchLabTestPanelsBySpecificSample(sample, auth)
      setResultItems(response)
    }catch(error){
      console.log("ERROR GETTING PANELS")
    }
  }

  const handleSendEquipment = async (foundPanel, formValue, helpers) => {
    try {
      const formData = {
        test_request_panel: foundPanel.id,
        equipment: formValue.equipment.value,
      }
      setLoading(true);
      await sendToEquipment(formData, auth).then(() => {
        helpers.resetForm();
        // toast.success("Send to Equipment Successful!");
        setLoading(false);
        handleClose();
      });
    } catch (err) {
      // toast.error(err);
      setLoading(false);
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(auth){
      getTestPanelsBySampleId(sample, auth)
    }
  }, [sample])


  const panels = resultItems.map((item)=> {
    const foundPanel = labTestPanels.find((panel)=>panel.id === item.test_panel)
    if(foundPanel){
      return (
        <li key={`${foundPanel.id}_panel`}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              handleSendEquipment(item, values); 
              resetForm(); 
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit} className="w-full flex items-center bg-red-400">
                <span className='w-full'>{foundPanel.name}</span>
                <div className='w-full'>
                  <SeachableSelect
                    name="equipment"
                    options={labEquipments.map((equipment) => ({ value: equipment.id, label: equipment.name }))}
                  />
                </div>
                <div className='w-full justify-end flex'>
                  <FormButton label={`send to equipment`}/>
                </div>
              </form>
            )}
          </Formik>
        </li>
      );
    }
  })

  const approveCollection = async () => {
    try{
      const payload = {
        is_sample_collected: true,
        id:sample
      }
      await updatePhlebotomySamples(payload, auth)
      setStatus(true)
    }catch(error){
      console.log("ERR APPROVING COLLECTION OF SAMPLE", error)
    }
  }

  return (
    <>
      <ul className='flex gap-3 flex-col px-4'>
          <li className='flex justify-between'>
              <span className='text-primary w-full'>panel name</span>
              <span className='text-primary w-full'>select equipment</span>
              <span className='text-primary w-full'></span>
          </li>
          {panels}
      </ul>
      { !collected && !status && (<div className='w-full flex justify-end'>
        <button onClick={approveCollection} className='bg-primary text-white p-2 rounded-lg'>collect</button>
      </div>)}
    </>
  )
}

export default TestPanelsItem