import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiPlus, HiEye, HiTrash, HiPencil } from 'react-icons/hi';
import API from '../services/api';

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            // baseURL-டன் சேர்த்து சரியாக /api/v1/cars என ரிக்வெஸ்ட் செல்லும்
            const response = await API.get('/api/v1/cars');
            const carData = Array.isArray(response.data) 
                ? response.data 
                : (response.data.data || response.data.cars || []);
            setCars(carData);
        } catch (err) {
            console.error("Error fetching cars:", err);
            setError('Failed to fetch car list.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCar = async (id) => {
        if (!window.confirm('Are you sure you want to delete this car?')) return;

        try {
            await API.delete(`/api/v1/cars/${id}`);
            alert('Car deleted successfully');
            setCars(cars.filter((car) => car._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete car.');
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-lg text-slate-400">Loading Car List...</div>;
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Manage Cars ({cars.length})</h1>
                <Link 
                    to="/admin/add-car" 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    <HiPlus />
                    Add New Car
                </Link>
            </div>

            {error && <p className="text-red-400 bg-red-500/10 p-3 rounded-md text-center mb-4">{error}</p>}

            {cars.length === 0 ? (
                <p className="text-center text-slate-400 mt-10">No cars available.</p>
            ) : (
                <div className="overflow-x-auto bg-slate-900 rounded-xl border border-slate-800">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-950/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Image</th>
                                <th scope="col" className="px-6 py-3">Car Name</th>
                                <th scope="col" className="px-6 py-3">Brand</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Price / Day</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map((car) => {
                                const carImage = car.image || car.imageUrl || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800';

                                return (
                                    <tr key={car._id || car.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                        <td className="p-4">
                                            <img 
                                                src={carImage} 
                                                alt={car.name || 'Car'} 
                                                className="w-20 h-12 object-cover rounded-md bg-slate-800" 
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">{car.name}</td>
                                        <td className="px-6 py-4">{car.brand}</td>
                                        <td className="px-6 py-4">{car.category}</td>
                                        <td className="px-6 py-4 font-semibold text-emerald-400">₹{car.pricePerDay}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                <Link 
                                                    to={`/cars/${car._id || car.id}`}
                                                    className="p-2 text-slate-400 hover:text-cyan-400 transition" title="View"
                                                >
                                                    <HiEye className="w-5 h-5" />
                                                </Link>
                                                <Link
                                                    to={`/admin/edit-car/${car._id || car.id}`}
                                                    className="p-2 text-slate-400 hover:text-amber-400 transition" title="Edit"
                                                >
                                                    <HiPencil className="w-5 h-5" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDeleteCar(car._id || car.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 transition" title="Hosting Delete"
                                                >
                                                    <HiTrash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CarList;