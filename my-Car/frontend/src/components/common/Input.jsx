import React from 'react';

const Input = ({ 
    label, 
    type = 'text', 
    name, 
    value, 
    onChange, 
    placeholder = '', 
    required = false, 
    disabled = false, 
    error = '', 
    rows = 3,
    style = {} 
}) => {
    return (
        <div className="flex flex-col gap-1.5 w-full" style={style}>
            {label && (
                <label htmlFor={name} className="font-bold text-sm text-white">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {type === 'textarea' ? (
                <textarea 
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    rows={rows}
                    className={`p-2.5 text-base rounded-md ${error ? 'border-red-500' : 'border-slate-700'} ${disabled ? 'bg-slate-800 cursor-not-allowed' : 'bg-slate-900'} text-white resize-y outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
            ) : (
                <input 
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`p-2.5 text-base rounded-md ${error ? 'border-red-500' : 'border-slate-700'} ${disabled ? 'bg-slate-800 cursor-not-allowed' : 'bg-slate-900'} text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
            )}

            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default Input;