import React from 'react'
import { GoPlus } from 'react-icons/go'
import { Button } from '@/components/ui/button'

const FloatButton = ({ onClick }) => {
  return (
    <Button
      className="fixed bottom-6 right-6 w-[60px] h-[60px] md:w-[82px] md:h-[68px] bg-white hover:bg-gray-100 text-black flex items-center justify-center"
      onClick={onClick}
      style={{ borderRadius: 8, border: '1px #D9D9D9 solid' }}
    >
      <GoPlus className='text-black w-8 h-8 md:w-10 md:h-10' />
    </Button>
  )
}

export default FloatButton
