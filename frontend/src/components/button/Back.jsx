import React from 'react'
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Back = ({ prop }) => {
    const navigate = useNavigate();
    return <>
        <button onClick={() => navigate(prop)}>
            <IoArrowBackCircleOutline className="h-10 w-10 text-blue-600 hover:text-purple-600 transition-colors duration-300" />
        </button>
    </>
}

export default Back
