import React from 'react';

const Loader = ({ size = '40px', color = '#007bff', text = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 gap-4 w-full">
            <div
                className="rounded-full border-4 border-gray-200 border-t-4 animate-spin"
                style={{ width: size, height: size, borderTopColor: color }}
            ></div>
            
            {text && (
                <p className="m-0 text-base text-slate-400 font-medium">
                    {text}
                </p>
            )}
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default Loader;