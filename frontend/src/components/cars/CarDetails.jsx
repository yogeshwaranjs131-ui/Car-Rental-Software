import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://car-rental-software.onrender.com';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch single car details when component loads
    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/cars/${id}`);
                const carData = response.data.data || response.data;
                setCar(carData);
            } catch (err) {
                setError('Failed to load car details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetails();
    }, [id]);

    // இமேஜ் URL ஐ முழுமையாகச் சரிசெய்து எடுக்கும் முறை
    const getImageUrl = (imagePath) => {
        const placeholder = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800';
        if (!imagePath) return placeholder;

        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        const normalizedPath = String(imagePath).replace(/\\/g, '/');
        const cleanPath = normalizedPath.startsWith('/')
            ? normalizedPath
            : normalizedPath.startsWith('uploads/')
                ? `/${normalizedPath}`
                : `/uploads/${normalizedPath}`;

        return `${API_BASE_URL}${cleanPath}`;
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: '#fff', fontSize: '18px' }}>Loading Car Details...</div>;
    }

    if (error || !car) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: '#ff6b6b', fontSize: '18px' }}>{error || 'Car not found.'}</div>;
    }

    // டேட்டாபேஸில் எந்தப் பெயரில் இமேஜ் ஃபீல்டு இருந்தாலும் அதைத் துல்லியமாகத் தேடி எடுக்கும் பாதுகாப்பு முறை
    const rawImage = 
        car?.image || 
        car?.imageUrl || 
        car?.img || 
        car?.carImage || 
        car?.photo;

    const carImage = getImageUrl(rawImage);

    return (
        <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', border: '1px solid #334155', borderRadius: '12px', backgroundColor: '#0f172a', color: '#fff' }}>
            <button 
                onClick={() => navigate(-1)} 
                style={{ marginBottom: '20px', padding: '8px 15px', backgroundColor: '#475569', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
            >
                ← Back
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <img 
                    src={carImage} 
                    alt={car.name || 'Car'} 
                    style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#1e293b' }} 
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'; 
                    }} 
                />

                <div>
                    <h2 style={{ margin: '0 0 10px 0', fontSize: '26px' }}>{car.name}</h2>
                    <p style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#94a3b8' }}>Brand: <strong style={{ color: '#fff' }}>{typeof car.brand === 'object' ? car.brand?.name : car.brand}</strong></p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', background: '#1e293b', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                        <p style={{ margin: '0', color: '#94a3b8' }}>Category: <strong style={{ color: '#fff' }}>{typeof car.category === 'object' ? car.category?.name : car.category}</strong></p>
                        <p style={{ margin: '0', color: '#94a3b8' }}>Seats: <strong style={{ color: '#fff' }}>{car.seats || '5'}</strong></p>
                        <p style={{ margin: '0', color: '#94a3b8' }}>Fuel Type: <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{car.fuelType || 'Petrol'}</strong></p>
                        <p style={{ margin: '0', color: '#94a3b8' }}>Price: <strong style={{ color: '#38bdf8' }}>₹{car.pricePerDay} / day</strong></p>
                    </div>

                    <button 
                        onClick={() => navigate(`/book-car/${car._id || car.id}`)}
                        style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                    >
                        Book This Car Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;