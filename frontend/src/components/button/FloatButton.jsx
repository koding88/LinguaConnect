import React from 'react'
import { IoAdd } from 'react-icons/io5'
import { Button } from '@/components/ui/button'

const FloatButton = ({ onClick }) => {
    return (
        <Button
            className="fixed bottom-6 right-6 w-[70px] h-[70px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transform hover:scale-105 transition-all duration-300 hidden lg:flex"
            onClick={onClick}
        >
            <IoAdd className='text-white w-9 h-9' />
        </Button>
    )
}

export default FloatButton
