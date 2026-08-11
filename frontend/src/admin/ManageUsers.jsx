import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all users when component loads
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.get('http://localhost:5000/api/users', config);
            setUsers(response.data.data || response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete user
    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.delete(`http://localhost:5000/api/users/${id}`, config);
            
            alert('User deleted successfully');
            setUsers(users.filter((user) => user._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user.');
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Users...</div>;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '20px' }}>
            <h2>Manage Users</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>User ID</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user._id}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', color: user.role === 'admin' ? 'purple' : 'blue' }}>
                                        {user.role || 'user'}
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <button 
                                            onClick={() => handleDeleteUser(user._id)}
                                            style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;