import React, { useState, useEffect } from 'react';
import API from '../services/api'; // 👈 நம்முடைய சரியான API இன்ஸ்டன்ஸ் இம்போர்ட் செய்யப்பட்டுள்ளது
import CarCard from '../components/cars/CarCard';
import CarFilter from '../components/cars/CarFilter';

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // ஃபில்டர் ஸ்டேட்டுகள்
    const [filters, setFilters] = useState({
        brand: '',
        category: '',
        searchQuery: ''
    });

    // டேட்டாபேஸிலிருந்து கார்களைப் பெறுதல்
    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                // 👈 இங்கே baseURL ஏற்கனவே /api/v1 என இருப்பதால், நாம் வெறும் /cars என்று அழைத்தால் போதும்!
                const response = await API.get('/cars'); 
                
                const payload = response?.data;
                const carList = Array.isArray(payload?.data)
                    ? payload.data
                    : Array.isArray(payload)
                        ? payload
                        : [];
                
                console.log("Fetched Cars from Database:", carList);
                setCars(carList);
                setFilteredCars(carList);
            } catch (err) {
                setError('Failed to fetch cars. Please try again later.');
                console.error("Error fetching cars:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    // துல்லியமான கேஸ்-சென்சிட்டிவ் ஃபில்டர் லாஜிக்
    useEffect(() => {
        let result = cars;

        if (filters.searchQuery && filters.searchQuery.trim() !== '') {
            result = result.filter((car) =>
                car && typeof car.name === 'string' &&
                car.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
            );
        }

        if (filters.brand && filters.brand !== '') {
            result = result.filter((car) => 
                car && car.brand &&
                car.brand.toString().toLowerCase().trim() === filters.brand.toString().toLowerCase().trim()
            );
        }

        if (filters.category && filters.category !== '') {
            result = result.filter((car) => 
                car && car.category &&
                car.category.toString().toLowerCase().trim() === filters.category.toString().toLowerCase().trim()
            );
        }

        setFilteredCars(result);
    }, [filters, cars]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px', color: '#fff' }}>Loading Cars...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px', color: '#ff6b6b' }}>{error}</div>;
    }

    const uniqueBrands = [...new Set(cars.map(car => car.brand).filter(Boolean))];
    const uniqueCategories = [...new Set(cars.map(car => car.category).filter(Boolean))];

    return (
        <div className="w-full min-h-screen bg-slate-950 m-0 p-4 sm:p-6 lg:p-8">
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '30px', textAlign: 'center' }}>
                Our Fleet
            </h1>
            
            <CarFilter 
                filters={filters} 
                setFilters={setFilters} 
                carBrands={uniqueBrands} 
                carCategories={uniqueCategories} 
            />
            
            {filteredCars.length === 0 && !loading && (
                <p style={{ textAlign: 'center', marginTop: '40px', color: '#ccc', fontSize: '18px' }}>
                    No cars match your criteria.
                </p>
            )}

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 m-0 p-0">
                {filteredCars.map(car => (
                    <CarCard key={car._id || car.id} car={car} />
                ))}
            </div>
        </div>
    );
};

export default Cars;