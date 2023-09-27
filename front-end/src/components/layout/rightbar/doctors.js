import React from 'react'

const Doctors = () => {
  return (
    <section className='space-y-1'>
        <div className="flex items-center justify-between border border-gray-400 rounded-xl p-2">
          <div className="flex gap-2 items-center">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src="/images/doc.jpg"
              alt=""
            />
            <div className="text-xs">
              <p>Dr. Patrick</p>
              <p>Surgeon</p>
            </div>
          </div>
          <div className="text-xs text-blue-800">
            <p>On Duty</p>
          </div>
        </div>
        <div className="flex items-center justify-between border border-gray-400 rounded-xl p-2">
          <div className="flex gap-2 items-center">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src="/images/doc.jpg"
              alt=""
            />
            <div className="text-xs">
              <p>Dr. Jairus</p>
              <p>Surgeon</p>
            </div>
          </div>
          <div className="text-xs text-red-800">
            <p>Off Duty</p>
          </div>
        </div>
      </section>
  )
}

export default Doctors