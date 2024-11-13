import React from 'react'
import { LuSearchX } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const Error = ({content}) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-4 h-screen">
            <LuSearchX className="h-20 w-20 text-gray-400" />
            <h1 className="text-2xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Oops!
                </span>
            </h1>
            <p className="text-lg font-semibold">Sorry, this {content} does not exist</p>
            <p className="text-gray-500">The {content} you followed may be broken, or the {content} may have been removed.</p>
            <Button
                className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                onClick={() => navigate('/')}
            >
                Go back home
            </Button>
        </div>
    )
}

export default Error
