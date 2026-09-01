import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 text-white leading-relaxed">
            <h1 className="text-4xl font-bold mb-4 text-blue-500 text-center">Privacy Policy</h1>
            <p className="text-center text-slate-400 mb-8 text-base">
                Last updated: August 6, 2026
            </p>

            <div className="flex flex-col gap-6 text-base">
                <section>
                    <h3 className="text-2xl font-bold text-white mb-3">1. Introduction</h3>
                    <p className="m-0 text-slate-300">
                        Welcome to Car Rental Portal. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-white mb-3">2. Data We Collect</h3>
                    <p className="m-0 mb-2 text-slate-300">
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                    </p>
                    <ul className="list-disc list-inside pl-5 text-slate-300 m-0">
                        <li><strong>Identity Data:</strong> Includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data:</strong> Includes billing address, delivery address, email address, and telephone numbers.</li>
                        <li><strong>Financial Data:</strong> Includes bank account and payment card details.</li>
                        <li><strong>Transaction Data:</strong> Includes details about payments to and from you and other details of cars you have rented from us.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-white mb-3">3. How We Use Your Data</h3>
                    <p className="m-0 text-slate-300">
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances: where we need to perform the contract we are about to enter into or have entered into with you, where it is necessary for our legitimate interests, and where we need to comply with a legal obligation.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-white mb-3">4. Data Security</h3>
                    <p className="m-0 text-slate-300">
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-white mb-3">5. Contact Us</h3>
                    <p className="m-0 text-slate-300">
                        If you have any questions about this privacy policy or our privacy practices, please contact us at support@carrentalportal.com.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;