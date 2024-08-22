import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { fetchGroupPermissions } from '@/redux/service/auth';
import { useAuth } from '@/assets/hooks/use-auth';

const GroupPermissionItem = ( { group } ) => {
    const auth = useAuth()
    const allPermissions = useSelector((store)=> store.auth.allPermissions);
    const userCurrentPermissions = useSelector((store)=> store.auth.userPermissions);
    const [ availableUserPermissions, setAvailableUserPermissions ] = useState();

    const getUserAvailablePermissions = async (id, auth) => {
      await fetchGroupPermissions(id, auth).then((res)=> setAvailableUserPermissions(res.permissions))
    }

    // currently removes and adds permissions from frontend and need logic to add to backend.

    const handleChanged = (perm) => {
      // Check if the permission is already in availableUserPermissions
      const index = availableUserPermissions.findIndex(p => p.name === perm.name);
    
      if (index !== -1) {
        // If permission is already present, remove it
        const updatedPermissions = [...availableUserPermissions];
        updatedPermissions.splice(index, 1);
        setAvailableUserPermissions(updatedPermissions);
      } else {
        // If permission is not present, add it
        setAvailableUserPermissions(prevPermissions => [...prevPermissions, perm]);
      }
    };

    useEffect(()=>{
      if(auth){
        getUserAvailablePermissions(group.id, auth);
     }
    }, [group]);

    const allPermissionsAvailable = allPermissions.map((perm)=> (
      <li className='flex justify-between w-full px-4' key={`permissions_Keys_${perm.id}`}>
        <span>{perm.name}</span>
        <input type='checkbox' 
          onChange={()=> handleChanged(perm)} 
          checked={availableUserPermissions?.some(permission => permission.name === perm.name)}
        />
      </li> 
      )
    )

  return (
    <div className='border border-gray my-2 p-2'>
      <label className='font-bold'>{group.name}</label>
      <div>
          <ul className='grid grid-cols-2'>
            {allPermissionsAvailable}
          </ul>
      </div>
    </div>
  )
}

export default GroupPermissionItem