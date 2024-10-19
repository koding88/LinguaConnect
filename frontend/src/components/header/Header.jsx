import React from 'react'
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Back from '@/components/button/Back';

const Header = ({ props }) => {
    return <>
        <div className='flex items-center justify-between py-6'>
            <Back prop={props?.path} />
            <h1 className='text-center text-black text-lg font-medium mr-8 flex-grow'>{props?.title}</h1>
        </div>
    </>
}

export default Header
