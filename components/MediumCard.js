import React from 'react'
import Image from 'next/image'
import { useRouter } from "next/router";

function MediumCard({id,img, name, type, description, ratings, address, price, category}) {
  const router = useRouter();
  // const classSearch = () => {
  //   router.push({
  //     pathame:'/class',
  //     params: {
  //       img: img,
  //       name: name,
  //       type: type,
  //       description: description,
  //       ratings:ratings,
  //       address:address,
  //       price:price,
  //       category:category
  //     }
  //   })
  // }
  const classSearch = () => {
    router.push({
      pathname: '/classes',
      query: {
        id: id
      },
    });
  }
  return (
    <div onClick={classSearch} className='cursor-pointer hover:scale-105 transform transition duration-300 ease-out'>
        <div className='relative h-80 w-80'>
            <Image src={img} layout="fill" className='rounded-xl'/>
        </div>
        <h3 className='text-2xl mt-3'>{type}</h3>
    </div>
  )
}

export default MediumCard