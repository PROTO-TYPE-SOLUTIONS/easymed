import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useAuth } from '@/assets/hooks/use-auth';
import { fetchLabTestPanelsByTestRequestId, updateLabRequestPanels } from '@/redux/service/laboratory';
import FormButton from '@/components/common/button/FormButton';

const TestResultsPanels = ({test}) => {
  const auth = useAuth()
  const [resultItems, setResultItems]=useState([])
  const { labTestPanels } = useSelector((store) => store.laboratory);

  const getTestPanelsByTestReq = async (test, auth)=> {
    try {
      const response = await fetchLabTestPanelsByTestRequestId(test, auth)
      setResultItems(response)
    }catch(error){
      console.log("ERROR GETTING PANELS")
    }
  }

  useEffect(()=>{
    if(auth){
      getTestPanelsByTestReq(test, auth)
    }
  }, [test])

  function checkRange(ref_value_low, ref_value_high, result) {
    if (parseInt(result) < parseInt(ref_value_low)) {
        return "low";
    } else if (parseInt(result) > parseInt(ref_value_high)) {
        return "high";
    } else {
        return "";
    }
  }

  const approveLabResults = async () => {

    const payload = {
        id:test,
        result_approved: true
    }

    try{
        setLoading(true)
        await updateLabRequestPanels(payload, auth)
        setLoading(false)
        console.log("SUCCESS APPROVAL", response)

    }catch(error){
        setLoading(false)
        console.log("FAILED APPROVAL", error)
    }

}


  const panels = resultItems.map((item)=> {
    const foundPanel = labTestPanels.find((panel)=>panel.id === item.test_panel)
    if(foundPanel){
      const flag = checkRange(foundPanel.ref_value_low,foundPanel.ref_value_high,item.result)
      return(
        <li key={`${foundPanel.id}_panel`} className='flex justify-between items-center'>
            <span className='w-full py-2'>{foundPanel.name}</span>
            <span className='w-full text-center py-2'>{item.result}</span>
            <span className={`w-full text-center py-2 ${flag === 'high' ? 'text-warning': 'text-orange'}`}>{flag}</span>
            <span className='w-full text-center py-2'>{foundPanel.ref_value_low}</span>
            <span className='w-full text-center py-2'>{foundPanel.ref_value_high}</span>
            <span className='w-full text-center py-2'>{foundPanel.unit}</span>
            <div onClick={approveLabResults} className='flex justify-end'>
                  <FormButton label={`approve results`}/>
            </div>
        </li>
      )
    }
  })

  return (
    <>
      <ul className='flex gap-3 flex-col px-2'>
          <li className='flex justify-between'>
              <span className='text-primary w-full'>panel name</span>
              <span className='text-primary w-full text-center'>Result</span>
              <span className='text-primary w-full text-center'>flag</span>
              <span className='text-primary w-full text-center'>Ref Val Low</span>
              <span className='text-primary w-full text-center'>Ref Val High</span>
              <span className='text-primary w-full text-center'>unit</span>
              <span className='text-primary w-full text-center'></span>
          </li>
          {panels}
      </ul>
    </>
  )
}

export default TestResultsPanels