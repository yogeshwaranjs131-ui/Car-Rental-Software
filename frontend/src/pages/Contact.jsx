import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://car-rental-software.onrender.com';
const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSubmitted(false);

        try {
            await axios.post(`${API_BASE_URL}/api/v1/contact`, formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form on success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 text-white">
            <h1 className="text-4xl font-bold mb-4 text-blue-500 text-center">Contact Us</h1>
            <p className="text-center text-slate-400 mb-8 text-base">
                Have questions or need assistance? We'd love to hear from you. Send us a message!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-5">Get in Touch</h3>
                    
                    <div className="mb-5">
                        <strong className="block text-base text-white mb-1.5 font-semibold">Address</strong>
                        <p className="m-0 text-base text-slate-400 leading-relaxed">
                            123 Rental Street, Auto Hub, Chennai, India
                        </p>
                    </div>

                    <div className="mb-5"><strong className="block text-base text-white mb-1.5 font-semibold">Email</strong><p className="m-0 text-base text-slate-400">support@carrentalportal.com</p></div>
                    <div className="mb-5"><strong className="block text-base text-white mb-1.5 font-semibold">Phone</strong><p className="m-0 text-base text-slate-400">+91 98765 43210</p></div>
                </div>

                {/* Contact Form */}
                <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
                    {submitted && !error && (
                        <div className="text-center py-10">
                            <h3 className="text-green-500 mb-2 text-2xl font-bold">Thank You!</h3>
                            <p className="text-slate-400 text-base m-0">
                                Your message has been sent successfully. We will get back to you soon.
                            </p>
                        </div>
                    )}

                    {!submitted && (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {error && <p className="text-red-400 bg-red-500/10 p-3 rounded-md text-center text-sm">{error}</p>}
                            <div>
                                <label className="block mb-1.5 font-bold text-sm text-white">
                                    Your Name
                                </label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your name"
                                    className="w-full p-2.5 rounded-md border border-slate-700 bg-slate-800 text-white text-sm box-border focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-1.5 font-bold text-sm text-white">
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    className="w-full p-2.5 rounded-md border border-slate-700 bg-slate-800 text-white text-sm box-border focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-1.5 font-bold text-sm text-white">
                                    Subject
                                </label>
                                <input 
                                    type="text" 
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter subject"
                                    className="w-full p-2.5 rounded-md border border-slate-700 bg-slate-800 text-white text-sm box-border focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-1.5 font-bold text-sm text-white">
                                    Message
                                </label>
                                <textarea 
                                    name="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="Type your message here..."
                                    className="w-full p-2.5 rounded-md border border-slate-700 bg-slate-800 text-white text-sm box-border resize-y focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="py-3 bg-blue-600 text-white border-none rounded-md font-bold text-base cursor-pointer mt-3 hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;