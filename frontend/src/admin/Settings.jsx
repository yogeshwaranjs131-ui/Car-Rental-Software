import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        theme: 'light',
        currency: 'INR'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch user settings when component loads
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.get('https://car-rental-software.onrender.com/api/settings', config);
            const data = response.data.data || response.data;
            setSettings({
                emailNotifications: data.emailNotifications ?? true,
                smsNotifications: data.smsNotifications ?? false,
                theme: data.theme || 'light',
                currency: data.currency || 'INR'
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load settings.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.put('https://car-rental-software.onrender.com/api/settings', settings, config);
            setMessage('Settings updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Settings...</div>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Account Settings</h2>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ fontWeight: 'bold' }}>Preferences</label>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input 
                            type="checkbox" 
                            name="emailNotifications" 
                            checked={settings.emailNotifications} 
                            onChange={handleChange} 
                        />
                        Enable Email Notifications
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input 
                            type="checkbox" 
                            name="smsNotifications" 
                            checked={settings.smsNotifications} 
                            onChange={handleChange} 
                        />
                        Enable SMS Notifications
                    </label>
                </div>

                <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Theme Style:</label>
                    <select 
                        name="theme" 
                        value={settings.theme} 
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                    </select>
                </div>

                <div>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Currency:</label>
                    <select 
                        name="currency" 
                        value={settings.currency} 
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    disabled={saving}
                    style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {saving ? 'Saving Settings...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default Settings;