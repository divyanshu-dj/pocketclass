import React from 'react'
import Link from 'next/link';

function StickyFooter() {
    return (
        <div className="stickyFooter bg-slate-100 text-sm text-gray-600 h-[auto] bottom-0 xl:sticky lg:sticky md:sticky border-t-2">
            <div className='mx-5 py-3 max-w-[1800px] mx-auto md:px-5 sm:grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1'>
                <div className="leftSide flex xl:flex-row lg:flex-row md:flex-col sm:flex-col sm:justify-center sm:items-center md:justify-center xl:justify-start lg:justify-start gap-x-5">
                    <p className='font-light'>&copy; pocketclass</p>
                    <p className='font-light hover:text-logo-red hover:scale-105 transition transform duration-200 ease-out active:scale-90 transition duration-150'><Link href="/community/aboutus">About Us</Link></p>
                    <p className='font-light hover:text-logo-red hover:scale-105 transition transform duration-200 ease-out active:scale-90 transition duration-150'><Link href="/community/instructorguide">Instructor Guide</Link></p>
                    <p className='font-light hover:text-logo-red hover:scale-105 transition transform duration-200 ease-out active:scale-90 transition duration-150'><Link href="/community/studentguide">Student Guide</Link></p>
                    <p className='font-light hover:text-logo-red hover:scale-105 transition transform duration-200 ease-out active:scale-90 transition duration-150'><Link href="/community/termsandconditions">Terms and Conditions</Link></p>
                </div>
                <div className="rightSide flex sm:justify-center md:justify-center xl:justify-end lg:justify-end gap-x-5">
                    <h5 className='font-normal font-light'>Support</h5>
                </div>
            </div>
        </div>
    )
}

export default StickyFooter