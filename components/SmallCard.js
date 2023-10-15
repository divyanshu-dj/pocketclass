import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router';

function SmallCard({ img, type, category, swiperRef, setSelectedCategory }) {
  const router = useRouter()

  const handleSmallCardClick = (event) => {
    const targetClassList = event?.target?.classList;
    if (!targetClassList.contains('swiper-button-next') &&
      !targetClassList.contains('swiper-button-prev') &&
      !targetClassList.contains('swiper-slide') &&
      !targetClassList.contains('swiper-wrapper')
    ) {
      setSelectedCategory(type)
      // router.push({
      //   pathname: '/search',
      //   query: {
      //     searchInput: type,
      //     startDate: new Date().toISOString(),
      //     endDate: new Date().toISOString(),
      //     noOfGuests: 1
      //   },
      // });
    }

  }

  // hover:bg-gray-100 hover:scale-105 transition transform duration-200 ease-out 

  return (
    <div className='flex flex-col justify-center items-center rounded-xl cursor-pointer' onClick={(e) => handleSmallCardClick(e)}>
      {/* Left */}
      <div className='relative h-12 w-12'>
        <Image src={img} layout="fill" className='rounded-lg' unoptimized />
      </div>

      {/* Right */}
      <div className='text-xs text-center'>
        <h2 className='text-xs text-center'>{type}</h2>
        <h3 className='text-gray-500 text-xs'>{category}</h3>
      </div>
    </div>
  )
}

export default SmallCard