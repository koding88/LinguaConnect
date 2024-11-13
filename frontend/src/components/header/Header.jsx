import React from 'react'
import Back from '@/components/button/Back';

const Header = ({ props }) => {
    return <>
        <div className={`flex items-center justify-between pb-6 ${props?.className}`}>
            <div className='flex items-center justify-center hover:scale-150 transition-transform duration-300 ease-in-out'>
                <Back prop={props?.path} />
            </div>
            <h1 className='text-center text-3xl font-bold mr-8 flex-grow animate-fade-in'>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    {props?.title}
                </span>
            </h1>
        </div>
    </>
}

export default Header
