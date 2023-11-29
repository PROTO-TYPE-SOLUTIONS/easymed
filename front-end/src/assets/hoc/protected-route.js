import React from 'react'
import { useSelector } from 'react-redux'
import NotAuthorized from './not-authorised'


const ProtectedRoute = ({ permission,children }) => {
    const { userPermissions } = useSelector(( store ) => store.auth);


    // check if current user has permission to access the route in question
    const isAuthorized = userPermissions && userPermissions.find((perm) => perm === permission)

    if (!isAuthorized) {
      return <NotAuthorized />
    }

  return (
    <>{ children }</>
  )
}



export default ProtectedRoute