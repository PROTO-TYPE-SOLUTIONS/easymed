import React, { useState } from "react";

const Drugs = ({ item,selectedDrugs,setSelectedDrugs }) => {
    const [selected, setSelected] = useState(false);

    const handleSelect = () => {
        setSelected(!selected);
        if (!selected) {
          setSelectedDrugs([...selectedDrugs, item]);
        } else {
          const updatedSelection = selectedDrugs.filter(
            (drug) => drug.name !== item.name
          );
          setSelectedDrugs(updatedSelection);
        }
      }



  return (
    <div onClick={handleSelect} className="flex gap-2 cursor-pointer bg-white shadow rounded-xl p-2 my-2">
      <input type="checkbox" className="rounded" checked={selected} />
      <p className="text-xs">{item.name}</p>
    </div>
  );
};

export default Drugs;
