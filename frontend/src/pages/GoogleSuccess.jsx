import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GoogleSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // டோக்கனை localStorage-இல் சேமித்தல்
            localStorage.setItem('token', token);

            // Navbar போன்ற மற்ற பாகங்களுக்கு auth state மாறியதை அறிவித்தல்
            window.dispatchEvent(new Event('authChange'));

            // முகப்புப் பக்கத்திற்கு அனுப்புதல்
            navigate('/');
        } else {
            // டோக்கன் இல்லை என்றால், லாகின் பக்கத்திற்கு அனுப்புதல்
            console.error("Google auth token not found in URL.");
            navigate('/login');
        }
    }, [navigate, searchParams]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-950 text-white">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-lg font-semibold">Authenticating with Google...</p>
                <p className="text-sm text-slate-400">Please wait, you will be redirected shortly.</p>
            </div>
        </div>
    );
};

export default GoogleSuccess;