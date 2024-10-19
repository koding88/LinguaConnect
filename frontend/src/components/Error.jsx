import React from 'react'
import { LuSearchX } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const Error = ({content}) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-2 h-screen">
            <LuSearchX className="h-20 w-20 text-gray-500" />
            <p className="text-lg font-semibold">Sorry, this {content} does not exist</p>
            <p className="text-gray-500">The {content} you followed may be broken, or the {content} may have been removed.</p>
            <Button
                className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors duration-200"
                onClick={() => navigate('/')}
            >
                Go back
            </Button>
        </div>
    )
}

export default Error
