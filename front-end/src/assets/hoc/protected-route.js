import React from 'react'
import { useSelector } from 'react-redux'
import NotAuthorized from './not-authorised'


const ProtectedRoute = ({ permission,children }) => {
    const { userPermissions } = useSelector(( { auth }) => auth)

    console.log("USER_PERMISSIONS ",userPermissions)


    // check if current user has permission to access the route in question
    const isAuthorized = userPermissions && userPermissions.find((perm) => perm.name === permission)

    if (!isAuthorized) {
      return <NotAuthorized />
    }

  return (
    <>{ children }</>
  )
}



export default ProtectedRoute