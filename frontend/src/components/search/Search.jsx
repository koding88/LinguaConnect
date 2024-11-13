import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CiSearch } from "react-icons/ci";

const Search = ({ onSearch, placeholder = "Search users...", buttonText = "Search" }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (searchTerm.trim()) {
            onSearch(searchTerm);
        }
    }

    return (
        <div className="relative max-w-2xl mx-auto">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder={placeholder}
                    className="w-full h-12 pl-12 pr-24 rounded-xl border border-gray-200 text-gray-600 text-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-200
                        bg-white/80 backdrop-blur-sm"
                    aria-label="Search input"
                />
                <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <Button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600
                    text-white hover:shadow-lg transition-all duration-200 rounded-lg text-sm"
                aria-label="Search button"
            >
                {buttonText}
            </Button>
        </div>
    );
};

export default Search;
