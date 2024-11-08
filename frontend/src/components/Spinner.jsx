import React from 'react'

const Spinner = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div
                className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"
                style={{
                    borderTopColor: '#1a1a1a',
                    animationDuration: '0.6s'
                }}
                role="status"
                aria-label="Loading"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

export default Spinner
