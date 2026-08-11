import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';

const AdminLayout = () => {
    return (
        /* w-full மற்றும் h-screen மூலம் ஒட்டுமொத்த ஸ்கிரீனையும் ஆக்கிரமிக்கும் */
        <div className="flex h-screen w-full bg-slate-950 text-slate-50 overflow-hidden font-sans">
            
            {/* Sidebar Component */}
            <Sidebar />
            
            {/* Main Content Area - max-w-7xl நீக்கப்பட்டு முழு அகலத்திற்கும் விரிவுபடுத்தப்பட்டுள்ளது */}
            <main className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto m-0 p-0 border-l border-slate-800/60 rounded-tl-3xl shadow-2xl">
                
                {/* கார்பெட் ஸ்டைல் கண்டெய்னர் - எந்தவித பக்கவாட்டு கேப்பும் இல்லாமல் முழுமையாக விரிவடையும் */}
                <div className="w-full h-full p-6 sm:p-8 m-0">
                    <Outlet />
                </div>

            </main>
        </div>
    );
};

export default AdminLayout;