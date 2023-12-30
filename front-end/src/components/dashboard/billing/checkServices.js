import React, { useState } from "react";
import Appointments from "./appointments";
import LabRequests from "./lab-requests";
import Drugs from "./drugs";


const appointments = [
  { name: "appointment one" },
  { name: "appointment two" },
  { name: "appointment three" },
  { name: "appointment four" },
];

const labRequests = [
  { name: "labrequest one" },
  { name: "labrequest two" },
  { name: "labrequest three" },
  { name: "labrequest four" },
];

const drugs = [
  { name: "prescribed drug one" },
  { name: "prescribed drug two" },
  { name: "prescribed drug three" },
  { name: "prescribed drug four" },
];

const PatientCheckServices = ({ patientAppointment }) => {
  const [selectedAppointments,setSelectedAppointments] = useState([]);
  const [selectedDrugs,setSelectedDrugs] = useState([]);
  const [selectedRequest,setSelectedRequest] = useState([]);

  return (
    <section className="flex items-stretch gap-4 bg-background p-2">
      <div className="w-4/12">
        <h1 className="text-center">Appointment</h1>
        <section>
          {appointments.map((item, index) => (
            <Appointments key={index} {...{item,selectedAppointments,setSelectedAppointments}} />
          ))}
        </section>
      </div>
      <div className="w-4/12">
        <h1 className="text-center">Lab Test Request</h1>
        <section>
          {labRequests.map((item, index) => (
            <LabRequests key={index} {...{item,selectedRequest,setSelectedRequest}} />
          ))}
        </section>
      </div>
      <div className="w-4/12">
        <h1 className="text-center">Prescribed Drug</h1>
        <section>
          {drugs.map((item, index) => (
            <Drugs key={index} {...{item,selectedDrugs,setSelectedDrugs}} />
          ))}
        </section>
      </div>
    </section>
  );
};

export default PatientCheckServices;
