import { doctorData } from "@/assets/menu";
import React from "react";

const Doctors = () => {
  return (
    <section className="space-y-1">
      <h1 className="uppercase text-xs font-semibold">Doctors</h1>
      {doctorData.map((doc, index) => (
        <div key={index} className="flex items-center justify-between bg-white shadow-xl rounded-xl px-2 py-1">
          <div className="flex gap-2 items-center">
            <img
              className="w-6 h-6 rounded-full object-cover"
              src="/images/doc.jpg"
              alt=""
            />
            <div className="text-xs">
              <p>{doc.name}</p>
              <p>{doc.specialisation}</p>
            </div>
          </div>
          <div className="text-xs">
            <p className="text-success font-bold">{doc.status}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Doctors;
