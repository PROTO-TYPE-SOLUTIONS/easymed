import React from "react";

const BookedSessions = () => {
  return (
    <>
      <section className="space-y-1">
        <div className="flex items-center justify-between bg-white shadow-xl rounded-xl p-2">
          <div className="text-xs">
            <p>Japheth Mbone</p>
          </div>
          <div className="text-xs text-primary">
            <p>12th July 2024</p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-white shadow-xl rounded-xl p-2">
          <div className="text-xs">
            <p>Japheth Mbone</p>
          </div>
          <div className="text-xs text-warning">
            <p>12th July 2024</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookedSessions;
