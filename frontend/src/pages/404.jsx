import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
            <h1 className="text-8xl font-bold animate-fade-in">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    404
                </span>
            </h1>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center max-w-lg">
                <div className="space-y-4">
                    <p className="text-xl font-semibold">Oops! Page not found.</p>
                    <p className="text-gray-500">
                        The page you are looking for might have been removed or is temporarily unavailable.
                    </p>
                    <Link to="/">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                            Go Back Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
