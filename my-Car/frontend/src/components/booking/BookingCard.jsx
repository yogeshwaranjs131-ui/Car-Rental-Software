import React from 'react';

const BookingCard = ({ booking, onCancel, onConfirm }) => {
    return (
        <div className="border border-slate-700 rounded-xl p-5 bg-slate-900 shadow-lg flex flex-col gap-4 text-white">
            <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">
                    Booking ID: {booking._id}
                </span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-300' : booking.status === 'Cancelled' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                    {booking.status || 'Pending'}
                </span>
            </div>

            <div className="flex gap-4 items-center">
                {booking.car?.image && (
                    <img src={booking.car.image} alt={booking.car.name || 'Car'} className="w-24 h-14 object-cover rounded-md" />
                )}
                <div>
                    <h4 className="text-lg font-semibold mb-1">{booking.car?.name || 'Car Name'}</h4>
                    <p className="text-sm text-slate-400">Brand: {booking.car?.brand || 'N/A'}</p>
                </div>
            </div>

            <div className="flex justify-between text-sm border-t border-slate-700 pt-3">
                <span>Total Price: <strong>₹{booking.totalPrice}</strong></span>
                <span>Date: {new Date(booking.createdAt).toLocaleDateString()}</span>
            </div>

            {(onCancel || onConfirm) && ( // Only show buttons if onCancel or onConfirm are provided
                <div className="flex gap-3 mt-2">
                    {onConfirm && booking.status !== 'Confirmed' && ( // Only show Confirm button if status is not Confirmed
                        <button onClick={() => onConfirm(booking._id)} className="flex-1 py-2 bg-green-600 text-white border-none rounded-md cursor-pointer font-bold hover:bg-green-700 transition-colors">
                            Confirm
                        </button>
                    )}
                    {onCancel && booking.status !== 'Cancelled' && ( // Only show Cancel button if status is not Cancelled
                        <button onClick={() => onCancel(booking._id)} className="flex-1 py-2 bg-red-600 text-white border-none rounded-md cursor-pointer font-bold hover:bg-red-700 transition-colors">
                            Cancel
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookingCard;