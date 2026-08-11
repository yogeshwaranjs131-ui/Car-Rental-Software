import React from 'react';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    style = {},
    fullWidth = false,
    className = ''
}) => {
    const baseClasses = "px-5 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg backdrop-blur-sm border";

    const variantClasses = {
        primary: 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/40 hover:text-white focus:ring-blue-500',
        success: 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/40 hover:text-white focus:ring-green-500',
        danger: 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/40 hover:text-white focus:ring-red-500',
        secondary: 'bg-slate-500/20 text-slate-300 border-slate-500/30 hover:bg-slate-500/40 hover:text-white focus:ring-slate-500',
        outline: 'bg-transparent text-slate-300 border-slate-700 hover:bg-slate-500/20 focus:ring-slate-500',
    };

    const widthClass = fullWidth ? 'w-full' : 'w-auto';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={style}
            className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;