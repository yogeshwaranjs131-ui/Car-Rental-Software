import React from 'react';

const BookingSummary = ({ booking, car, onProceedToPayment }) => {
    if (!booking || !car) {
        return <div style={{ textAlign: 'center', marginTop: '20px' }}>No booking summary available.</div>;
    }

    const startDate = new Date(booking.startDate).toLocaleDateString();
    const endDate = new Date(booking.endDate).toLocaleDateString();

    return ( 
        <div className="max-w-md mx-auto mt-8 p-6 bg-slate-900 rounded-xl shadow-lg border border-slate-800 text-white">
            <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
            
            <div className="flex gap-4 items-center mt-5 pb-4 border-b border-slate-700">
                <img src={car.image} alt={car.name} className="w-32 h-16 object-cover rounded-md" />
                <div>
                    <h3 className="text-lg font-semibold mb-1">{car.name}</h3>
                    <p className="text-sm text-slate-400">Brand: {car.brand}</p>
                    <p className="mt-1 text-green-400 font-bold">₹{car.pricePerDay} / day</p>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 text-base">
                <div className="flex justify-between">
                    <span className="text-slate-400">Start Date:</span>
                    <strong>{startDate}</strong>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-400">End Date:</span>
                    <strong>{endDate}</strong>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-400">Total Days:</span>
                    <strong>{booking.totalDays || 'N/A'} Days</strong>
                </div>

                <div className="flex justify-between border-t border-slate-700 pt-3 mt-2 text-lg">
                    <span className="font-bold">Total Amount:</span>
                    <strong className="text-blue-400">₹{booking.totalPrice}</strong>
                </div>
            </div>

            {onProceedToPayment && ( // Only show button if onProceedToPayment is provided
                <button onClick={onProceedToPayment} className="w-full mt-6 py-3 bg-green-600 text-white border-none rounded-md cursor-pointer font-bold text-lg hover:bg-green-700 transition-colors">
                    Proceed to Payment
                </button>
            )}
        </div>
    );
};

export default BookingSummary;