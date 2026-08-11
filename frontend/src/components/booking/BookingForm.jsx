import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// தமிழ்நாட்டின் மாவட்டங்கள் மற்றும் முக்கிய நகரங்களின் விரிவான பட்டியல்
const tnLocations = [
    // Districts (மாவட்டங்கள்)
    "Ariyalur, Tamil Nadu", "Chengalpattu, Tamil Nadu", "Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu", 
    "Cuddalore, Tamil Nadu", "Dharmapuri, Tamil Nadu", "Dindigul, Tamil Nadu", "Erode, Tamil Nadu", 
    "Kallakurichi, Tamil Nadu", "Kanchipuram, Tamil Nadu", "Kanyakumari, Tamil Nadu", "Karur, Tamil Nadu", 
    "Krishnagiri, Tamil Nadu", "Madurai, Tamil Nadu", "Mayiladuthurai, Tamil Nadu", "Nagapattinam, Tamil Nadu", 
    "Namakkal, Tamil Nadu", "Nilgiris, Tamil Nadu", "Perambalur, Tamil Nadu", "Pudukkottai, Tamil Nadu", 
    "Ramanathapuram, Tamil Nadu", "Ranipet, Tamil Nadu", "Salem, Tamil Nadu", "Sivaganga, Tamil Nadu", 
    "Tenkasi, Tamil Nadu", "Thanjavur, Tamil Nadu", "Theni, Tamil Nadu", "Thoothukudi, Tamil Nadu", 
    "Tiruchirappalli, Tamil Nadu", "Tirunelveli, Tamil Nadu", "Tirupathur, Tamil Nadu", "Tiruppur, Tamil Nadu", 
    "Tiruvallur, Tamil Nadu", "Tiruvannamalai, Tamil Nadu", "Tiruvarur, Tamil Nadu", "Vellore, Tamil Nadu", 
    "Viluppuram, Tamil Nadu", "Virudhunagar, Tamil Nadu",
    // Major Cities & Towns (முக்கிய நகரங்கள்)
    "Aamboor, Tamil Nadu", "Arakkonam, Tamil Nadu", "Aruppukkottai, Tamil Nadu", "Attur, Tamil Nadu",
    "Bhavani, Tamil Nadu", "Bodinayakanur, Tamil Nadu", "Chidambaram, Tamil Nadu", "Devakottai, Tamil Nadu",
    "Dharapuram, Tamil Nadu", "Edappadi, Tamil Nadu", "Gingee, Tamil Nadu", "Gobichettipalayam, Tamil Nadu",
    "Gudiyatham, Tamil Nadu", "Hosur, Tamil Nadu", "Kadayanallur, Tamil Nadu", "Karaikudi, Tamil Nadu",
    "Kodaikanal, Tamil Nadu", "Kovilpatti, Tamil Nadu", "Kumbakonam, Tamil Nadu", "Mannargudi, Tamil Nadu",
    "Mettupalayam, Tamil Nadu", "Mettur, Tamil Nadu", "Nagapattinam, Tamil Nadu", "Nagercoil, Tamil Nadu",
    "Neyveli, Tamil Nadu", "Ooty, Tamil Nadu", "Palani, Tamil Nadu", "Pallavaram, Tamil Nadu",
    "Paramakudi, Tamil Nadu", "Pattukkottai, Tamil Nadu", "Pollachi, Tamil Nadu", "Rajapalayam, Tamil Nadu",
    "Rameswaram, Tamil Nadu", "Sankarankovil, Tamil Nadu", "Sathyamangalam, Tamil Nadu", "Sirkazhi, Tamil Nadu",
    "Sivakasi, Tamil Nadu", "Srivilliputhur, Tamil Nadu", "Tambaram, Tamil Nadu", "Tindivanam, Tamil Nadu",
    "Tiruchendur, Tamil Nadu", "Tiruchengode, Tamil Nadu", "Tirukoilur, Tamil Nadu", "Tiruttani, Tamil Nadu",
    "Udumalaipettai, Tamil Nadu", "Valparai, Tamil Nadu", "Vaniyambadi, Tamil Nadu", "Vedaranyam, Tamil Nadu",
    // Other Important Places
    "Adirampattinam, Tamil Nadu", "Alangulam, Tamil Nadu", "Ambasamudram, Tamil Nadu", "Anamalai, Tamil Nadu",
    "Arcot, Tamil Nadu", "Avadi, Tamil Nadu", "Avinashi, Tamil Nadu", "Cheyyar, Tamil Nadu",
    "Colachel, Tamil Nadu", "Coonoor, Tamil Nadu", "Denkanikottai, Tamil Nadu", "Gudalur, Tamil Nadu",
    "Harur, Tamil Nadu", "Jayankondam, Tamil Nadu", "Jolarpettai, Tamil Nadu", "Kadambur, Tamil Nadu",
    "Kalakkad, Tamil Nadu", "Kalavai, Tamil Nadu", "Kallidaikurichi, Tamil Nadu", "Kangeyam, Tamil Nadu",
    "Kattumannarkoil, Tamil Nadu", "Kayalpattinam, Tamil Nadu", "Kilakarai, Tamil Nadu", "Kothagiri, Tamil Nadu",
    "Kulithalai, Tamil Nadu", "Kuzhithurai, Tamil Nadu", "Lalgudi, Tamil Nadu", "Manapparai, Tamil Nadu",
    "Manamadurai, Tamil Nadu", "Mayiladuthurai, Tamil Nadu", "Melur, Tamil Nadu", "Musiri, Tamil Nadu",
    "Nanguneri, Tamil Nadu", "Nannilam, Tamil Nadu", "Oddanchatram, Tamil Nadu", "Omalur, Tamil Nadu",
    "Padmanabhapuram, Tamil Nadu", "Palladam, Tamil Nadu", "Panruti, Tamil Nadu", "Papanasam, Tamil Nadu",
    "Peravurani, Tamil Nadu", "Periyakulam, Tamil Nadu", "Pernampattu, Tamil Nadu", "Polur, Tamil Nadu",
    "Ponneri, Tamil Nadu", "Poonamallee, Tamil Nadu", "Portonovo, Tamil Nadu", "Puliyankudi, Tamil Nadu",
    "Radhapuram, Tamil Nadu", "Rasipuram, Tamil Nadu", "Sathankulam, Tamil Nadu", "Sattur, Tamil Nadu",
    "Shenkottai, Tamil Nadu", "Sholinghur, Tamil Nadu", "Sivagiri, Tamil Nadu", "Sriperumbudur, Tamil Nadu",
    "Srivaikuntam, Tamil Nadu", "Tharangambadi, Tamil Nadu", "Thirumangalam, Tamil Nadu", "Thiruthuraipoondi, Tamil Nadu",
    "Thuraiyur, Tamil Nadu", "Tirukalukundram, Tamil Nadu", "Tiruvadanai, Tamil Nadu", "Tiruvallur, Tamil Nadu",
    "Uthagamandalam, Tamil Nadu", "Uthangarai, Tamil Nadu", "Uthiramerur, Tamil Nadu", "Vadakkuvalliyur, Tamil Nadu",
    "Vandavasi, Tamil Nadu", "Velankanni, Tamil Nadu", "Vikramasingapuram, Tamil Nadu", "Walajapet, Tamil Nadu",
    // Neighboring States' Major Cities (அண்டை மாநில முக்கிய நகரங்கள்)
    "Bengaluru, Karnataka", "Hyderabad, Telangana", "Kochi, Kerala", "Puducherry", "Mumbai, Maharashtra", "Trivandrum, Kerala"
];

const BookingForm = ({ carId, pricePerDay }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [withDriver, setWithDriver] = useState(false);
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [loading, setLoading]  = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setPickupLocation(`Live Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
                },
                (err) => {
                    let errorMessage = 'Unable to retrieve your location. Please type manually.';
                    switch (err.code) {
                        case err.PERMISSION_DENIED:
                            errorMessage = 'Location permission denied. Please enable it in your browser settings to use this feature.';
                            break;
                        case err.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information is currently unavailable. Please check your device settings.';
                            break;
                        case err.TIMEOUT:
                            errorMessage = 'The request to get user location timed out. Please try again.';
                            break;
                    }
                    setError(errorMessage);
                }
            );
        } else {
            setError('Geolocation is not supported by your browser');
        }
    };

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const totalDays = calculateDays();
    const driverChargePerDay = withDriver ? 500 : 0;
    const dailyRate = (pricePerDay || 0) + driverChargePerDay;
    const totalAmount = totalDays * dailyRate;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (totalDays <= 0) {
            setError('End date must be after start date.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const userString = localStorage.getItem('user');
            const userInfo = userString ? JSON.parse(userString) : {};
            const userId = userInfo._id || userInfo.id;

            if (!userId) {
                setError('User not logged in. Please login to continue.');
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            const bookingData = {
                user: userId,
                car: carId,
                startDate,
                endDate,
                totalAmount,
                withDriver,
                pickupLocation,
                dropoffLocation
            };

            console.log("Sending booking data to backend:", bookingData);

            const response = await axios.post(`${API_BASE_URL}/api/v1/bookings`, bookingData, config);
            
            console.log("Full booking response from backend:", response.data);

            // 🛠️ பாதுகாப்பான முறையில் எந்த வடிவத்திலிருந்தும் Booking ID-ஐ எடுக்கும் முறை
            const responseData = response.data?.data || response.data?.booking || response.data;
            const bookingId = responseData?._id || responseData?.id || responseData?.bookingId;

            if (!bookingId) {
                console.error("Backend response structure missing ID:", response.data);
                throw new Error("Booking created, but ID was not returned from server.");
            }

            console.log("Navigating to payments with bookingId:", bookingId, "and totalAmount:", totalAmount);
            navigate('/payments', { state: { bookingId, totalAmount } });
        } catch (err) {
            console.error("Booking Error Response:", err.response?.data || err.message);
            setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Validation failed! Please check all fields.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="w-full text-slate-200 text-base">
                <div className="flex items-center gap-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    <h3 className="text-2xl font-bold text-white">Booking Itinerary</h3>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm mb-5" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                    {/* Chauffeur Toggle */}
                    <div className="flex justify-between items-center p-2.5 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div className="flex flex-col">
                            <span className="block font-semibold text-slate-200 text-base">Executive Chauffeur</span>
                            <span className="text-slate-400 text-sm">Includes professional driver (+₹500/day)</span>
                        </div>
                        <label className="relative inline-block w-12 h-7 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={withDriver} 
                                onChange={(e) => setWithDriver(e.target.checked)}
                                className="sr-only peer"
                            />
                            <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-300 ${withDriver ? 'bg-indigo-600' : 'bg-slate-500'} peer-focus:ring-2 peer-focus:ring-indigo-500`}></span>
                            <span className={`absolute h-5 w-5 left-1 bottom-1 bg-white rounded-full transition-transform duration-300 ${withDriver ? 'translate-x-5' : 'translate-x-0'}`}></span>
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <label className="block mb-1.5 text-slate-400 uppercase tracking-wider font-semibold text-sm">Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full p-2.5 rounded-md border border-slate-600 bg-slate-700/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base" />
                        </div>
                        <div className="flex-1 relative">
                            <label className="block mb-1.5 text-slate-400 uppercase tracking-wider font-semibold text-sm">End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="w-full p-2.5 rounded-md border border-slate-600 bg-slate-700/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base" />
                        </div>
                    </div>

                    {/* Pick-up Location */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-slate-400 uppercase tracking-wider font-semibold text-sm">Pick-up Location</label>
                            <button type="button" onClick={handleGetCurrentLocation} className="text-blue-400 hover:text-blue-300 font-semibold px-2 py-1 rounded-md transition-colors duration-200 text-sm">
                                📍 Use Live Location
                            </button>
                        </div>
                        <input 
                            type="text" 
                            list="tn-locations"
                            placeholder="Select TN district or type any location in India..."
                            value={pickupLocation} 
                            onChange={(e) => setPickupLocation(e.target.value)}
                            required
                            className="w-full p-2.5 rounded-md border border-slate-600 bg-slate-700/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        />
                        <datalist id="tn-locations">
                            {tnLocations.map((location, index) => (
                                <option key={`pickup-${index}`} value={location} />
                            ))}
                        </datalist>
                    </div>

                    {/* Drop-off Location */}
                    <div>
                        <label className="block mb-1.5 text-slate-400 uppercase tracking-wider font-semibold text-sm">Drop-off Location</label>
                        <input 
                            type="text" 
                            list="tn-locations"
                            placeholder="Select TN district or type destination..." 
                            value={dropoffLocation} 
                            onChange={(e) => setDropoffLocation(e.target.value)}
                            required
                            className="w-full p-2.5 rounded-md border border-slate-600 bg-slate-700/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        />
                    </div>

                    {/* Total Summary */}
                    {totalDays > 0 && (
                        <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 flex justify-between items-center mt-1">
                            <div className="flex flex-col">
                                <span className="text-slate-300 block text-base">Total Duration: <strong className="text-white">{totalDays} Days</strong></span>
                                {withDriver && <span className="text-green-400 font-semibold text-sm">✓ Chauffeur service included</span>}
                            </div>
                            <div className="text-right">
                                <span className="text-slate-400 block text-sm">Estimated Total</span>
                                <span className="text-2xl text-white font-bold">₹{totalAmount}</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Submit Button */}
                    <button type="submit" disabled={loading || totalDays <= 0} 
                        className="w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300 text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Processing Request...' : 'Confirm & Proceed to Payment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;