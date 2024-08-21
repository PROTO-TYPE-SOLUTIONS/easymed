import React, { useState } from 'react'

const MainSettingsNav = ( { setSelectedRoute, selectedRoute } ) => {
  return (
    <ul className='flex flex-row gap-4 items-center'>
        <li 
            className={`cursor-pointer ${selectedRoute === 'members' ? "font-semibold text-xl text-warning ": ""}`} 
            onClick={()=>setSelectedRoute("members")}
        >
            Members
        </li>
        <li
          className={`cursor-pointer ${selectedRoute === 'company' ? "font-semibold text-xl text-warning ": ""}`} 
          onClick={()=>setSelectedRoute("company")}
        >
          Company
        </li>
        <li
          className={`cursor-pointer ${selectedRoute === 'permissions' ? "font-semibold text-xl text-warning ": ""}`} 
          onClick={()=>setSelectedRoute("permissions")}
        >
            Permissions
        </li>
    </ul>
  )
}

export default MainSettingsNav;