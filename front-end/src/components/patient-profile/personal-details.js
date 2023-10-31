import React from "react";
import { FiEdit } from "react-icons/fi";


const PersonalDetails = () => {
  return (
    <>
      <form>
        <section className="space-y-2">
          <div>
            <label className="text-sm" htmlFor="first_name">
              First Name
            </label>
            <input
              className="border text-sm border-gray w-full focus:outline-none rounded-xl px-4 py-2"
              type="text"
              value="Marcos"
            />
          </div>
          <div>
            <label className="text-sm" htmlFor="second_name">
              Last Name
            </label>
            <input
              className="border text-sm border-gray w-full focus:outline-none rounded-xl px-4 py-2"
              type="text"
              value="Ochieng"
            />
          </div>
          <div>
            <label className="text-sm" htmlFor="email">
              Email
            </label>
            <input
              className="border text-sm border-gray w-full focus:outline-none rounded-xl px-4 py-2"
              type="email"
              value="marcos@gmail.com"
            />
          </div>
          <div className="flex items-center justify-end">
            <button className="bg-primary text-white shadow-xl px-4 text-sm py-2 rounded-xl flex items-center gap-2">
              <FiEdit />
              Edit
            </button>
          </div>
        </section>
      </form>
    </>
  );
};

export default PersonalDetails;
