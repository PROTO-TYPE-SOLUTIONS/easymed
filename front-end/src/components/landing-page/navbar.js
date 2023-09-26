import React from 'react'

const Navbar = () => {
  return (
    <section className='flex items-center justify-between h-[10vh]'>
        <div>
            <h1 className='text-white text-2xl'>Logo</h1>
        </div>
        <div>
            <ul className='flex items-center gap-4 text-white'>
                <li>Home</li>
                <li>About</li>
                <li>Services</li>
                <li>Doctors</li>
                <li>Blog</li>
            </ul>
        </div>
        <div>
            <button className='bg-[#FF5E20] px-3 py-2 rounded text-white'>Contact Us</button>
        </div>
    </section>
  )
}

export default Navbar