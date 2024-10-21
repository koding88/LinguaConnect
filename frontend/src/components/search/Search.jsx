import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const Search = ({ onSearch, placeholder = "Search...", buttonText = "Search", otherStyles = "" }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        onSearch(searchTerm);
        setSearchTerm('');
    }

    return (
        <div className={`w-full ${otherStyles || "mx-6"}  h-12 relative`}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={placeholder}
                className="w-full h-12 px-6 pr-24 rounded-lg border border-[#d5d5d5] text-sm focus:outline-none focus:shadow-md focus:border-transparent transition-all duration-300 ease-in-out"
                aria-label="Search input"
            />
            <Button
                onClick={handleSearch}
                className="absolute right-2 top-2 w-20 h-8 bg-black hover:bg-gray-800 rounded-md text-white text-sm transition-colors duration-300 ease-in-out flex items-center justify-center"
                aria-label="Search button"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {buttonText}
            </Button>
        </div>
    );
};

export default Search;
