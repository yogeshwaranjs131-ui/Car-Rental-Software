import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="flex justify-center items-center gap-3 my-8">
            <button onClick={handlePrevious} disabled={currentPage === 1} className={`px-4 py-2 rounded-md border font-bold transition-colors ${currentPage === 1 ? 'bg-slate-700 text-slate-400 border-slate-600 cursor-not-allowed' : 'bg-blue-600 text-white border-blue-700 cursor-pointer hover:bg-blue-700'}`}>
                Previous
            </button>

            <span className="text-base font-medium text-white">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>

            <button onClick={handleNext} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-md border font-bold transition-colors ${currentPage === totalPages ? 'bg-slate-700 text-slate-400 border-slate-600 cursor-not-allowed' : 'bg-blue-600 text-white border-blue-700 cursor-pointer hover:bg-blue-700'}`}>
                Next
            </button>
        </div>
    );
};

export default Pagination;