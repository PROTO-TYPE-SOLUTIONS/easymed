import React from "react";

const BookedSessions = () => {
  return (
    <>
      <section className="space-y-1">
        <div className="flex items-center justify-between border border-gray-400 rounded-xl p-2">
          <div className="text-xs">
            <p>Japheth Mbone</p>
          </div>
          <div className="text-xs text-blue-800">
            <p>12th July 2024</p>
          </div>
        </div>
        <div className="flex items-center justify-between border border-gray-400 rounded-xl p-2">
          <div className="text-xs">
            <p>Japheth Mbone</p>
          </div>
          <div className="text-xs text-red-800">
            <p>12th July 2024</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookedSessions;
