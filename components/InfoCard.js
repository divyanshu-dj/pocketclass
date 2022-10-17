import React from 'react'
import Image from 'next/image'
import { HeartIcon } from '@heroicons/react/outline';
import { StarIcon } from '@heroicons/react/solid';

function InfoCard({ type, latitude, name, images, description, longitude, ratings, address, price, category}) {
    return (
        <div className='flex py-7 px-2 border-b cursor-pointer hover:opacity-80 hover:shadow-lg pr-4 transition duration-200 ease-out first:border-t'>
            <div className='relative h-24 w-40 md:h-52 md:w-80 flex-shrink-0'>
                <Image src={images[0]} layout="fill" objectFit="cover" className='rounded-xl' />
            </div>

            <div className='flex flex-col flex-grow pl-5'>
                <div className='flex justify-between'>
                    {/* <p>{`Lat: ${latitude} Lon: ${longitude}`}</p> */}
                    <h4 className='text-xl'>{name}</h4>
                    <HeartIcon className='h-7 cursor-pointer' />
                </div>
                <p>{`@ ${address}`}</p>
                <div className='border-b w-10 pt-2' />
                <p className='pt-2 text-sm text-gray-400 flex-grow'>{description}</p>

                <div className='flex justify-between items-end pt-5'>
                    <p className='flex'><StarIcon className='h-5 text-red-400' />
                        {ratings[0]}</p>

                    <div>
                        {/* <p className='text-lg font-semibold pb-2 lg:text-2xl'>{price}</p> */}
                        {/* <p className='text-right font-extralight'>{total}</p> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoCard