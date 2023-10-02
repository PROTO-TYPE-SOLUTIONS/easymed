import React from 'react'

const Doctors = () => {
  return (
    <section className='space-y-1'>
        <div className="flex items-center justify-between bg-white shadow-xl rounded-xl px-2 py-1">
          <div className="flex gap-2 items-center">
            <img
              className="w-6 h-6 rounded-full object-cover"
              src="/images/doc.jpg"
              alt=""
            />
            <div className="text-xs">
              <p>Dr. Patrick</p>
              <p>Surgeon</p>
            </div>
          </div>
          <div className="text-xs text-primary">
            <p>On Duty</p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-white shadow-xl rounded-xl px-2 py-1">
          <div className="flex gap-2 items-center">
            <img
              className="w-6 h-6 rounded-full object-cover"
              src="/images/doc.jpg"
              alt=""
            />
            <div className="text-xs">
              <p>Dr. Jairus</p>
              <p>Surgeon</p>
            </div>
          </div>
          <div className="text-xs text-warning">
            <p>Off Duty</p>
          </div>
        </div>
      </section>
  )
}

export default Doctors