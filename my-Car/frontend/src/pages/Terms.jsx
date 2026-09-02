import React from 'react';

const Terms = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 text-white leading-relaxed">
            <h1 className="text-4xl font-bold mb-4 text-blue-500 text-center">Terms & Conditions</h1>
            <p className="text-center text-slate-400 mb-8 text-base">
                Last updated: August 6, 2026
            </p>

            <div className="flex flex-col gap-6 text-base">
                <section>
                    <h3 className="text-2xl font-bold text-white mb-3">1. Agreement to Terms</h3>
                    <p className="m-0 text-slate-300">
                        By accessing or using our Car Rental Portal, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-white mb-3">2. Rental Eligibility</h3>
                    <p className="m-0 text-slate-300">
                        To rent a vehicle from our platform, you must be at least 21 years of age, possess a valid driver's license, and provide a valid government-issued photo ID along with a secure payment method.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-white mb-3">3. Bookings, Cancellations & Payments</h3>
                    <p className="m-0 text-slate-300">
                        All bookings are subject to vehicle availability and confirmation. Payments must be made online through our secure gateway. Free cancellations are allowed up to 24 hours prior to the scheduled pickup time. Late cancellations may incur a fee.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-white mb-3">4. User Responsibilities</h3>
                    <p className="m-0 text-slate-300">
                        You agree to use the rented vehicle responsibly, obey all local traffic laws, and refrain from driving under the influence of alcohol or drugs. You are fully responsible for any fines, tolls, or damages incurred during your rental period.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-white mb-3">5. Limitation of Liability</h3>
                    <p className="m-0 text-slate-300">
                        Car Rental Portal shall not be held liable for any indirect, incidental, or consequential damages arising out of or in connection with the use of our rental vehicles or website services.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-white mb-3">6. Contact Information</h3>
                    <p className="m-0 text-slate-300">
                        If you have any questions concerning these Terms and Conditions, please reach out to us at support@carrentalportal.com.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Terms;