import React from 'react'
import Image from 'next/image'

function SmallCard({ img, type, category }) {
  return (
    <div className='flex items-center m-2 mt-5 rounded-xl cursor-pointer space-x-4 hover:bg-gray-100 hover:scale-105 transition transform duration-200 ease-out'>
      {/* Left */}
      <div className='relative h-16 w-16'>
        <Image src={img} layout="fill" className='rounded-lg' />
      </div>

      {/* Right */}
      <div>
        <h2>{category}</h2>
        <h3 className='text-gray-500'>{type}</h3>
      </div>
    </div>
  )
}

export default SmallCard