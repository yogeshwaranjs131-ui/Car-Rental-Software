import React from 'react';
import { HiSearch, HiX } from 'react-icons/hi';

const CarFilter = ({ filters, setFilters, carBrands, carCategories }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleReset = () => {
        setFilters({
            brand: '',
            category: '',
            searchQuery: ''
        });
    };

    const fallbackBrands = ['Kia', 'Tata', 'Toyota', 'Mahindra', 'Hyundai', 'Honda', 'BMW', 'Audi', 'Mercedes-Benz'];
    const brandsToDisplay = (carBrands && carBrands.length > 0) ? carBrands : fallbackBrands;

    const fallbackCategories = ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Convertible'];
    const categoriesToDisplay = (carCategories && carCategories.length > 0) ? carCategories : fallbackCategories;

    return (
        <div className="flex flex-wrap items-center gap-4 p-4 mb-6 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl shadow-lg">
            {/* Search Input */}
            <div className="relative grow min-w-55">
                <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                    type="text" 
                    name="searchQuery" 
                    placeholder="Search by car name..." 
                    value={filters.searchQuery || ''} 
                    onChange={handleChange}
                    className="w-full p-2.5 pl-10 text-sm rounded-md border border-slate-700 bg-slate-950 text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
                />
            </div>

            {/* Brand Dropdown */}
            <div className="grow min-w-40">
                <select 
                    name="brand" 
                    value={filters.brand || ''} 
                    onChange={handleChange}
                    className="w-full p-2.5 text-sm rounded-md border border-slate-700 bg-slate-950 text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">All Brands</option>
                    {brandsToDisplay.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>
            </div>

            {/* Category Dropdown */}
            <div className="grow min-w-40">
                <select 
                    name="category" 
                    value={filters.category || ''} 
                    onChange={handleChange}
                    className="w-full p-2.5 text-sm rounded-md border border-slate-700 bg-slate-950 text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">All Categories</option>
                    {categoriesToDisplay.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            {/* Reset Button */}
            <button 
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700/50 text-slate-300 border border-slate-700 rounded-md text-sm font-semibold hover:bg-slate-700 hover:text-white transition-colors"
            >
                <HiX />
                Reset Filters
            </button>
        </div>
    );
};

export default CarFilter;