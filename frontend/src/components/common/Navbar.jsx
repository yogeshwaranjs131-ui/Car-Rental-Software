import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const updateAuthState = () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser && storedUser !== "undefined") {
            try {
                const parsedUser = JSON.parse(storedUser);
                setIsLoggedIn(true);
                setUser(parsedUser);
            } catch (err) {
                console.error("Error parsing user data:", err);
                setIsLoggedIn(false);
                setUser(null);
            }
        } else {
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    useEffect(() => {
        updateAuthState();
        window.addEventListener('storage', updateAuthState);
        window.addEventListener('authChange', updateAuthState);

        return () => {
            window.removeEventListener('storage', updateAuthState);
            window.removeEventListener('authChange', updateAuthState);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('authChange'));
        setIsLoggedIn(false);
        setUser(null);
        setIsMenuOpen(false);
        alert("Logged out successfully!");
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-lg border-b border-white/10 px-4 sm:px-10 py-4 flex justify-between items-center shadow-xl">
            <Link to="/" className="flex items-center gap-3 no-underline">
                <img src="https://as1.ftcdn.net/jpg/00/65/83/52/1000_F_65835204_1jWSKhWvq7ncBkT3KZrNmm506Dorzu6q.jpg" alt="Logo" className="w-10 h-10 rounded-full object-cover border-2 border-blue-500" />
                <span className="text-white text-xl font-extrabold tracking-wide">
                    Car Rental
                </span>
            </Link>

            {isMobile && (
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-transparent border-none text-white text-2xl z-[1100] cursor-pointer md:hidden">
                    {isMenuOpen ? '✕' : '☰'}
                </button>
            )}

            {isMobile && isMenuOpen && (
                <div className="fixed top-0 right-0 h-screen w-64 bg-slate-900/95 backdrop-blur-md flex flex-col items-center pt-24 z-[1050] transition-transform duration-300 ease-in-out transform-none overflow-y-auto">
                    {renderNavLinks(true)}
                </div>
            )}

            {!isMobile && (
                <div className="hidden md:flex items-center gap-4">
                    {renderNavLinks(false)}
                </div>
            )}
        </nav>
    );

    function renderNavLinks(isMobileMenu) {
        const baseLinkClasses = "text-slate-200 no-underline text-sm font-medium px-3 py-2 rounded-md hover:bg-slate-700 hover:text-white transition-colors duration-200";
        const mobileOnlyClasses = "w-4/5 text-center my-1";
        const desktopOnlyClasses = "w-auto text-left";
        const buttonBaseClasses = "border-none cursor-pointer";
        const registerClasses = "bg-blue-600 text-white hover:bg-blue-700";
        const logoutClasses = "bg-red-600 text-white hover:bg-red-700";

        return (
            <div className={`flex items-center gap-4 ${isMobileMenu ? 'flex-col w-full' : 'flex-row'}`}>
                {isLoggedIn ? (
                    <>
                        <Link to="/" className={`${baseLinkClasses} ${isMobileMenu ? mobileOnlyClasses : desktopOnlyClasses}`} onClick={() => isMobileMenu && setIsMenuOpen(false)}>Home</Link>
                        <Link to="/cars" className={`${baseLinkClasses} ${isMobileMenu ? mobileOnlyClasses : desktopOnlyClasses}`} onClick={() => isMobileMenu && setIsMenuOpen(false)}>Cars</Link>
                        <Link to="/wishlist" className={`${baseLinkClasses} ${isMobileMenu ? mobileOnlyClasses : desktopOnlyClasses}`} onClick={() => isMobileMenu && setIsMenuOpen(false)}>Wishlist</Link>
                        <Link to="/my-bookings" className={`${baseLinkClasses} ${isMobileMenu ? mobileOnlyClasses : desktopOnlyClasses}`} onClick={() => isMobileMenu && setIsMenuOpen(false)}>My Bookings</Link>
                        <Link to="/faq" className={`${baseLinkClasses} ${isMobileMenu ? mobileOnlyClasses : desktopOnlyClasses}`} onClick={() => isMobileMenu && setIsMenuOpen(false)}>FAQ</Link>
                        <Link to="/profile" className={`${baseLinkClasses} ${isMobileMenu ? mobileOnlyClasses : desktopOnlyClasses}`} onClick={() => isMobileMenu && setIsMenuOpen(false)}>My Profile</Link>
                        
                        {user && (user.name || user.username) && (
                            <span className={`text-emerald-400 text-sm font-semibold py-2 ${isMobileMenu ? mobileOnlyClasses : 'mr-1'}`}>
                                Welcome, {user.name || user.username}
                            </span>
                        )}
                        <button onClick={handleLogout} className={`${baseLinkClasses} ${buttonBaseClasses} ${logoutClasses} ${isMobileMenu ? mobileOnlyClasses : desktopOnlyClasses}`}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/" className={`${baseLinkClasses} ${isMobileMenu ? mobileOnlyClasses : desktopOnlyClasses}`} onClick={() => isMobileMenu && setIsMenuOpen(false)}>Home</Link>
                        <Link to="/cars" className={`${baseLinkClasses} ${isMobileMenu ? mobileOnlyClasses : desktopOnlyClasses}`} onClick={() => isMobileMenu && setIsMenuOpen(false)}>Cars</Link>
                        <Link to="/faq" className={`${baseLinkClasses} ${isMobileMenu ? mobileOnlyClasses : desktopOnlyClasses}`} onClick={() => isMobileMenu && setIsMenuOpen(false)}>FAQ</Link>
                        <Link to="/login" className={`text-slate-200 no-underline text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-700 transition-colors duration-200 ${isMobileMenu ? mobileOnlyClasses : desktopOnlyClasses}`} onClick={() => isMobileMenu && setIsMenuOpen(false)}>Login</Link>
                        <Link to="/register" className={`text-white no-underline text-sm font-medium px-4 py-2 rounded-md ${buttonBaseClasses} ${registerClasses} ${isMobileMenu ? mobileOnlyClasses : desktopOnlyClasses}`} onClick={() => isMobileMenu && setIsMenuOpen(false)}>Register</Link>
                    </>
                )}
            </div>
        );
    }
};

export default Navbar;