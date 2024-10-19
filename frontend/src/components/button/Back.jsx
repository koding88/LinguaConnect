import React from 'react'
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Back = ({ prop }) => {
    const navigate = useNavigate();
    return <>
        <button onClick={() => navigate(prop)}>
            <IoArrowBackCircleOutline className="h-8 w-8" />
        </button>
    </>
}

export default Back
