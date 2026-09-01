import React, { useState } from 'react';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "What documents are required to rent a car?",
            answer: "You need a valid driver's license, a government-issued photo ID (such as a passport or Aadhar card), and a valid credit/debit card for the security deposit and payment."
        },
        {
            question: "What is the minimum age requirement to rent a car?",
            answer: "The minimum age requirement is 21 years old. Drivers under 25 may be subject to a young driver surcharge depending on the vehicle category."
        },
        {
            question: "Can I cancel or modify my booking?",
            answer: "Yes, you can cancel or modify your booking through your profile dashboard. Free cancellations are available up to 24 hours before your scheduled pickup time."
        },
        {
            question: "Is fuel included in the rental price?",
            answer: "No, fuel is not included in the daily rental rate. The car will be provided with a specific fuel level, and you are expected to return it with the same level."
        },
        {
            question: "Are there any mileage limits on my rental?",
            answer: "Most of our standard rentals come with unlimited mileage. However, specific luxury or long-distance promotional vehicles may have daily caps. Please check the specific car details before booking."
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 text-white">
            <h1 className="text-4xl font-bold mb-4 text-blue-500 text-center">Frequently Asked Questions</h1>
            <p className="text-center text-slate-400 mb-8 text-base">
                Find answers to common questions about renting, bookings, and policies.
            </p>

            <div className="flex flex-col gap-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-800">
                        <button onClick={() => toggleAccordion(index)} className="w-full p-5 bg-transparent border-none text-left text-lg font-bold text-white cursor-pointer flex justify-between items-center hover:bg-slate-800 transition-colors">
                            <span>{faq.question}</span>
                            <span className="text-xl text-blue-500">
                                {activeIndex === index ? '−' : '+'}
                            </span>
                        </button>

                        {activeIndex === index && (
                            <div className="px-5 pb-5 text-slate-400 text-base leading-relaxed border-t border-slate-700">
                                <p className="mt-4">{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;