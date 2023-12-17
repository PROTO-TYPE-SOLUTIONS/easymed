import React, { useState } from 'react'

const LabRequests = ({ item,selectedRequest,setSelectedRequest }) => {
    const [selected, setSelected] = useState(false);

    const handleSelect = () => {
        setSelected(!selected);
        if (!selected) {
          setSelectedRequest([...selectedRequest, item]);
        } else {
          const updatedSelection = selectedRequest.filter(
            (request) => request.name !== item.name
          );
          setSelectedRequest(updatedSelection);
        }
      }


  return (
    <div onClick={handleSelect} className="flex gap-2 cursor-pointer bg-white shadow rounded-xl p-2 my-2">
      <input type="checkbox" className="rounded" checked={selected} />
      <p className="text-xs">{item.name}</p>
    </div>
  )
}

export default LabRequests