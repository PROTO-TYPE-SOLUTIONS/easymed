import { bookedData } from "@/assets/menu";
import React from "react";

const BookedSessions = () => {
  return (
    <>
      <section className="space-y-1">
        <h1 className="uppercase text-xs font-semibold">Booked Sessions</h1>
        {bookedData.map((book, index) => (
          <div key={index} className="flex items-center justify-between bg-white shadow-xl rounded-xl p-2">
            <div className="text-xs">
              <p>{book.name}</p>
            </div>
            <div className="text-xs text-primary">
              <p>{book.date}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default BookedSessions;
