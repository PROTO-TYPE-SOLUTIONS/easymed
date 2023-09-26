import React from "react";
import Navbar from "./navbar";
import { AiFillPlayCircle } from "react-icons/ai";

const LandingPage = () => {
  return (
    <section className="heroSection px-24 py-4">
      <Navbar />
      <section className="flex items-center justify-between h-[84vh]">
        <div className="w-7/12 space-y-4">
          <h1 className="text-white font-bold text-4xl">
            Providing an Exceptional Patient Experience.
          </h1>
          <p className="text-white font-thin">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
            architecto reprehenderit esse iure enim temporibus id totam quaerat
            laudantium accusantium!
          </p>
          <div className="flex items-center gap-4">
            <button className="bg-[#FF5E20] text-white px-3 py-2 rounded">
              View Services
            </button>
            <button className="border border-[#FF5E20] text-white px-3 py-2 rounded">
              Book Appointment
            </button>
          </div>
        </div>
        <div className="w-5/12 flex items-center justify-center">
          <AiFillPlayCircle className="text-7xl" />
        </div>
      </section>
    </section>
  );
};

export default LandingPage;
