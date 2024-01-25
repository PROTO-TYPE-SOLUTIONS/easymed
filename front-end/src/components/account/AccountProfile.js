import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Grid } from '@mui/material'
import ProfileEdit from './ProfileEdit'
import { useAuth } from '@/assets/hooks/use-auth'
import { getUserById } from '@/redux/service/user'

const AccountProfile = () => {
  const auth = useAuth();
  const [user, setUser] = useState({})

  console.log(user)

  const getUser = async (auth) => {
    await getUserById(auth).then((res)=>setUser(res));
  }

  useEffect(()=>{
    if (auth){
      getUser(auth);
    }
  }, []);

  return (
    <div className='flex flex-col justify-between w-full px-4'>
      <div className='w-full border border-gray py-4 my-2 rounded'>
      <Grid className='justify-center flex px-8' container>
        <Grid className='' xs={6}>
          <div className='flex items-center gap-4'>
            <img
              className="h-28 w-28 rounded-full cursor-pointer"
              src="/images/doc.jpg"
              alt=""
            />
            <div className='flex flex-col text-center gap-2'>
              <p className='text-xl font-semibold'>{`${user.first_name} ${user.last_name}`}</p>
              <p className='text-sm'>{`${user.role}`}</p>
              <p className='text-sm'>{`${user.profession}`}</p>
            </div>
          </div>
        </Grid>
        <Grid className='text-center items-center justify-end flex' xs={6}>
          <div className='flex flex-col gap-4'>
            <div className='bg-primary rounded text-white px-4'>Active</div>
            <ProfileEdit/>
          </div>
        </Grid>
      </Grid>
      </div>
      <div className='w-full border border-gray py-4 my-2 rounded'>
        <h5 className='mb-4 pl-4 font-bold'>Personal Information</h5>
        <Grid className='justify-center flex px-8' container spacing={2}>
          <Grid className='my-4 gap-2 flex flex-col' xs={4}>
            <label>First Name</label>
            <p className='text-sm text-primary'>{`${user.first_name}`}</p>
          </Grid>
          <Grid className='my-4 gap-2 flex flex-col' xs={4}>
            <label>Last Name</label>
            <p className='text-sm text-primary'>{`${user.last_name}`}</p>          
          </Grid>
          <Grid className='my-4 gap-2 flex flex-col' xs={4}>
            <label>Email Address</label>
            <p className='text-sm text-primary'>{`${user.email}`}</p>
          </Grid>
          <Grid className='my-4 gap-2 flex flex-col' xs={4}>
            <label>Age</label>
            <p className='text-sm text-primary'>{`${user.age}`}</p>          
          </Grid>
          <Grid className='my-4 gap-2 flex flex-col' xs={4}>
            <label>Role</label>
            <p className='text-sm text-primary'>{`${user.role}`}</p>          
          </Grid>
          <Grid className='my-4 gap-2 flex flex-col' xs={4}>
            <label>Proffession</label>
            <p className='text-sm text-primary'>{`${user.profession}`}</p>          
          </Grid>
        </Grid>        
      </div>
    </div>
  )
}

export default AccountProfile;