import React from 'react'
import { Grid } from '@mui/material'


const AppointmentCard = ({ appointments }) => {

    const displayAppointments = appointments.map((appointment)=>{
        const timestamp = appointment.appointment_date_time;
        const dateTime = new Date(timestamp);
    
        // Get the numeric time of the day (e.g., '16:20')    
        const appointmentTime = dateTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        return (
        <Grid key={`appointments_${appointment.id}`} item xs={4} className='bg-white py-4 px-2 rounded-lg'>
            <div className='border-b border-gray py-2 flex flex-col gap-2'>
                <h5 className={`${appointment.assigned_doctor ? "font-semibold text-lg text-primary" : "text-warning" } `}>{appointment.assigned_doctor ? appointment.assigned_doctor : "waiting assignment"}</h5>
                <span className='text-xxs'>neural surgeon</span>
                <div className='flex justify-between items-center'>
                    <span className='text-xs text-primary_light'>{timestamp.split("T")[0]}</span>
                    <span className='text-xs text-white bg-primary px-2 py-1 rounded-lg '>{appointmentTime}</span>
                </div>
            </div>
            <div className='border-b border-gray py-2 flex flex-col gap-4'>
                <h5 className='font-semibold text-lg text-primary'>{`${appointment.first_name} ${appointment.second_name}`}</h5>
                <span className=''>{appointment.reason}</span>
            </div>
            <div className='flex items-center justify-center py-4 px-2'>
                <button className='w-full py-2 rounded-lg bg-primary_light text-white'>reschedule</button>
            </div>
        </Grid>
    )
    })

  return (
    <div className='grid grid-cols-3 gap-4'>
        {displayAppointments}
    </div>
  )
}

export default AppointmentCard