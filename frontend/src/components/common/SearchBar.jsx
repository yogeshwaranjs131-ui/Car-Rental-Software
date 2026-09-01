import React from 'react';
import { HiSearch } from 'react-icons/hi';

const SearchBar = ({ searchQuery, setSearchQuery, placeholder = 'Search...' }) => {
    return (
        <div className="relative flex w-full max-w-md items-center">
            <HiSearch className="absolute left-3.5 text-slate-500" />
            <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder={placeholder}
                className="w-full p-2.5 pl-10 text-base rounded-md border border-slate-700 bg-slate-900 text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
            />
        </div>
    );
};

export default SearchBar;