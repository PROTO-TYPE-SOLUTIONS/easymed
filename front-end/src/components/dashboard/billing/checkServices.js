import React, { useState } from "react";

const PatientCheckServices = ({ patientAppointment }) => {
    const [selectedItems, setSelectedItems] = useState({});

    console.log("SELECTED_ITEMS ",selectedItems);
    const handleItemClick = (index) => {
      setSelectedItems((prevSelected) => ({
        ...prevSelected,
        [index]: !prevSelected[index],
      }));
    };
  
    const isSelected = (index) => {
      return selectedItems[index] ? "#F2F2F6" : "";
    };

  
  return (
    <section className="flex items-stretch gap-4">
      <div className="w-4/12">
        <h1 className="text-center">Appointment</h1>
        <section
        onClick={() => handleItemClick(0)}
         className={`flex items-center cursor-pointer justify-between hover:bg-background gap-4 w-full my-2 border border-gray p-2 rounded ${isSelected(0)}`}>
          <div className="space-y-2">
            <p className="text-xs">Full Name</p>
            <p className="text-xs">Gender</p>
            <p className="text-xs">Date Created</p>
            <p className="text-xs">Assigned Doctor</p>
            <p className="text-xs">Age</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs">
              {patientAppointment.first_name}
              {patientAppointment.second_name}
            </p>
            <p className="text-xs"> {patientAppointment.gender}</p>
            <p className="text-xs">
              {new Date(patientAppointment.date_created).toLocaleDateString()}
            </p>
            <p className="text-xs"> Dr. Roselyda</p>
            <p className="text-xs"> {patientAppointment.age}</p>
          </div>
        </section>
      </div>
      <div className="w-4/12">
        <h1 className="text-center">Lab Test Request</h1>
        <section 
        onClick={() => handleItemClick(1)}
        className={`flex items-center cursor-pointer hover:bg-background justify-between gap-4 border border-gray p-2 rounded my-2 ${isSelected(1)}`}>
          <div className="space-y-2">
            <p className="text-xs">Full Name</p>
            <p className="text-xs">Gender</p>
            <p className="text-xs">Date Created</p>
            <p className="text-xs">Assigned Doctor</p>
            <p className="text-xs">Date Created</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs">
              {" "}
              {new Date(patientAppointment.date_created).toLocaleDateString()}
            </p>
            <p className="text-xs">
              {" "}
              {new Date(patientAppointment.date_created).toLocaleDateString()}
            </p>
            <p className="text-xs">
              {" "}
              {new Date(patientAppointment.date_created).toLocaleDateString()}
            </p>
            <p className="text-xs">
              {" "}
              {new Date(patientAppointment.date_created).toLocaleDateString()}
            </p>
            <p className="text-xs">
              {" "}
              {new Date(patientAppointment.date_created).toLocaleDateString()}
            </p>
          </div>
        </section>
      </div>
      <div className="w-4/12">
        <h1 className="text-center">Prescribed Drug</h1>
        <section 
        onClick={() => handleItemClick(2)}
        className={`flex items-center cursor-pointer hover:bg-background justify-between gap-4 border border-gray p-2 rounded my-2 ${isSelected(2)}`}>
          <div className="space-y-2">
            <p className="text-xs">Full Name</p>
            <p className="text-xs">Gender</p>
            <p className="text-xs">Date Created</p>
            <p className="text-xs">Assigned Doctor</p>
            <p className="text-xs">Date Created</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs">
              {" "}
              {new Date(patientAppointment.date_created).toLocaleDateString()}
            </p>
            <p className="text-xs">
              {" "}
              {new Date(patientAppointment.date_created).toLocaleDateString()}
            </p>
            <p className="text-xs">
              {" "}
              {new Date(patientAppointment.date_created).toLocaleDateString()}
            </p>
            <p className="text-xs">
              {" "}
              {new Date(patientAppointment.date_created).toLocaleDateString()}
            </p>
            <p className="text-xs">
              {" "}
              {new Date(patientAppointment.date_created).toLocaleDateString()}
            </p>
          </div>
        </section>
      </div>
    </section>
  );
};

export default PatientCheckServices;
