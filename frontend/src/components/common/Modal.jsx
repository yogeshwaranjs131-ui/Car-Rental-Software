import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md shadow-2xl relative flex flex-col gap-4 border border-slate-800 text-white">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 className="m-0 text-xl font-bold text-white">{title || 'Modal'}</h3>
                    <button onClick={onClose} className="bg-transparent border-none text-xl font-bold cursor-pointer text-slate-400 hover:text-white transition-colors">
                        &times;
                    </button>
                </div>

                <div className="mt-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;