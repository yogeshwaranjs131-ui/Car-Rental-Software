import API from './api';

// Get current user profile details
const getUserProfile = async () => {
    const response = await API.get('/users/profile');
    return response.data;
};

// Update current user profile details
const updateUserProfile = async (profileData) => {
    const response = await API.put('/users/profile', profileData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Change user password
const changePassword = async (passwordData) => {
    const response = await API.put('/users/change-password', passwordData);
    return response.data;
};

// Get user notification preferences or settings
const getUserSettings = async () => {
    const response = await API.get('/users/settings');
    return response.data;
};

// Update user notification preferences or settings
const updateUserSettings = async (settingsData) => {
    const response = await API.put('/users/settings', settingsData);
    return response.data;
};

const userService = {
    getUserProfile,
    updateUserProfile,
    changePassword,
    getUserSettings,
    updateUserSettings
};

export default userService;