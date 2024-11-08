import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Oops! Page not found.</p>
            <p className="text-lg text-gray-500 mb-8">The page you are looking for might have been removed or is temporarily unavailable.</p>
            <Link to="/">
                <Button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-300">
                    Go Back
                </Button>
            </Link>
        </div>
    );
};

export default NotFound;
