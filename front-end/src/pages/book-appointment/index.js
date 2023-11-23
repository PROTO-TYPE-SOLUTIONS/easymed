import React, { useState } from "react";
import BookAppointmentForm from "./book-appointment-form";

const BookAppointment = () => {
  const [selectedService, setSelectedService] = useState("");

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  return (
    <section className="flex items-center gap-8 h-screen overflow-hidden">
      <div className="md:w-1/2 w-full space-y-8 px-4">
        <section className="w-9/12 mx-auto">
          <div className="flex flex-col justify-center">
            <label htmlFor="first_name">Select Service</label>
            <select
              as="select"
              className="block text-sm pr-9 border border-gray py-2 px-4 focus:outline-none w-full"
              name="gender"
              value={selectedService}
              onChange={handleServiceChange}
            >
              <option value="">Select Service</option>
              <option value="G">General Service</option>
              <option value="L">Laboratory Services</option>
              <option value="P">Pharmacy Services</option>
            </select>
          </div>
        </section>
        {selectedService === "G" && <BookAppointmentForm />}
      </div>
      <div className="md:block hidden w-1/2">
        <section className="loginPage -2xl flex items-center justify-center p-4">
          <div className="text-white">
            <div className="space-y-4">
              <h1 className="text-2xl text-center">
                Welcome to Make Easy-HMIS
              </h1>
              <p className="text-sm text-center">We make Easy-HMIS</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default BookAppointment;
