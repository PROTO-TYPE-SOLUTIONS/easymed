import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '@/assets/hooks/use-auth';
import { fetchLabTestPanelsBySpecificSample } from '@/redux/service/laboratory';

const TestPanelsItem = ({sample, collected}) => {
  const auth = useAuth()
  const dispatch = useDispatch()
  const [resultItems, setResultItems]=useState([])
  const { labTestPanels, processAllTestRequest } = useSelector((store) => store.laboratory);

  const getTestPanelsBySampleId = async (sample, auth)=> {
    try {
      const response = await fetchLabTestPanelsBySpecificSample(sample, auth)
      setResultItems(response)
    }catch(error){
      console.log("ERROR GETTING PANELS")
    }
  }

  useEffect(()=>{
    if(auth){
      getTestPanelsBySampleId(sample, auth)
    }
  }, [sample])


  const panels = resultItems.map((item)=> {
    const foundPanel = labTestPanels.find((panel)=>panel.id === item.test_panel)
    if(foundPanel){
      return(
        <li key={`${foundPanel.id}_panel`} className='flex justify-between '>
          <span className='w-full'>{foundPanel.name}</span>
          <span className='w-full'>{foundPanel.unit}</span>
          <span className='w-full'>127</span>
          <span className='w-full'>110</span>
        </li>
      )
    }
  })

  return (
    <>
      <ul className='flex gap-3 flex-col px-4'>
          <li className='flex justify-between'>
              <span className='text-primary w-full'>panel name</span>
              <span className='text-primary w-full'>unit</span>
              <span className='text-primary w-full'>Ref Val High</span>
              <span className='text-primary w-full'>Ref Val Low</span>
          </li>
          {panels}
      </ul>
      { !collected && (<div className='w-full flex justify-end'>
        <button className='bg-primary text-white p-2 rounded-lg'>collect</button>
      </div>)}
    </>
  )
}

export default TestPanelsItem