import { setSelectedLabRequest } from '@/redux/features/billing';
import React, { useState } from 'react'
import { useSelector,useDispatch } from 'react-redux';

const LabRequests = ({ item,selectedRequest,setSelectedRequest }) => {
    const [selected, setSelected] = useState(false);
  const { selectedLabRequests } = useSelector((store) => store.billing);
  const dispatch = useDispatch();

  console.log("LABRE ",selectedLabRequests)

    const handleSelect = () => {
        setSelected(!selected);
        if (!selected) {
          dispatch(setSelectedLabRequest([...selectedLabRequests, item]));
        } else {
          const updatedSelection = selectedLabRequests.filter(
            (request) => request?.note !== item?.note
          );
          dispatch(setSelectedLabRequest(updatedSelection));
        }
      }

    const formateDate = (date) => {
      const format = new Date(date).toLocaleDateString();

      return format;
    }

  return (
    <div onClick={handleSelect} className="flex gap-2 cursor-pointer bg-white shadow rounded-xl p-2 my-2">
      <input type="checkbox" className="rounded" checked={selected} />
      <p className="text-xs">{formateDate(item?.date_created)}</p>
    </div>
  )
}

export default LabRequests