import React, { useState } from "react";

const Appointments = ({ item,selectedAppointments,setSelectedAppointments }) => {
    const [selected, setSelected] = useState(false);

    const handleSelect = () => {
        setSelected(!selected);
        if (!selected) {
          setSelectedAppointments([...selectedAppointments, item]);
        } else {
          const updatedSelection = selectedAppointments.filter(
            (appointment) => appointment.name !== item.name
          );
          setSelectedAppointments(updatedSelection);
        }
      }

  return (
    <div onClick={handleSelect} className="flex gap-2 cursor-pointer bg-white shadow rounded-xl p-2 my-2">
      <input type="checkbox" className="rounded" checked={selected} />
      <p className="text-xs">{item.name}</p>
    </div>
  );
};

export default Appointments;
