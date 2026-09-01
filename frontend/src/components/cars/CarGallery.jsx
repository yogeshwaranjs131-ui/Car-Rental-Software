import React, { useState } from 'react';
import CarCard from './CarCard';
import CarFilter from './CarFilter';
import useCars from '../../hooks/useCars';

const CarGallery = () => {
    // Custom hook மூலம் டேட்டா, லோடிங் மற்றும் எரர் எடுப்பது
    const { cars, loading, error } = useCars();
    
    const [filters, setFilters] = useState({
        brand: '',
        category: '',
        searchQuery: ''
    });

    // useEffect தேவையில்லை - நேரடியாகக் கணக்கிடலாம் (Direct Filtering)
    const filteredCars = cars.filter((car) => {
        // Search query filter (by name)
        if (filters.searchQuery) {
            const matchesName = car.name && car.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
            if (!matchesName) return false;
        }

        // Brand filter
        if (filters.brand) {
            if (car.brand !== filters.brand) return false;
        }

        // Category filter
        if (filters.category) {
            if (car.category !== filters.category) return false;
        }

        return true;
    });

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: '#94a3b8' }}>Loading Cars Gallery...</div>;
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '20px' }}>
            <h2 style={{ color: '#ffffff', marginBottom: '20px' }}>Car Gallery ({filteredCars.length})</h2>
            {error && <p style={{ color: '#f87171' }}>{error}</p>}

            {/* Filter Component */}
            <CarFilter filters={filters} setFilters={setFilters} />

            {filteredCars.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '40px', color: '#94a3b8' }}>No cars match your criteria.</p>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '20px', 
                    marginTop: '20px' 
                }}>
                    {filteredCars.map((car) => (
                        <CarCard key={car._id || car.id} car={car} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarGallery;