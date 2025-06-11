import React from 'react';
import { FaShieldAlt, FaLock, FaUserShield, FaComment } from 'react-icons/fa';

const Importance = () => {
  return (
    <section id="importance" className="py-20 bg-black text-white">
      <div className="container mx-auto text-center px-5">
        <h2 className="font-roman text-[40px] font-bold mb-12 leading-snug">
          Why Choose CyberShield?
        </h2>

        {/* Importance Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card Template */}
          {[
            {
              icon: <FaShieldAlt />,
              title: "Advanced Threat Protection",
              description: "Comprehensive protection against cyber threats targeting your social media interactions.",
            },
            {
              icon: <FaLock />,
              title: "Secure Content Uploads",
              description: "Safeguard your posts, comments, and media with top-tier encryption and security protocols.",
            },
            {
              icon: <FaUserShield />,
              title: "User Privacy Assurance",
              description: "Ensure the privacy and security of your personal data when interacting on social platforms.",
            },
            {
              icon: <FaComment />,
              title: "Safe Commenting & Posting",
              description: "Prevent malicious activity while maintaining secure and genuine interactions within your posts and comments.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 bg-gradient-to-r from-[#bbd2c5] to-[#536976] text-white rounded-lg shadow-lg"
            >
              <div className="text-4xl mb-4 flex justify-center">{item.icon}</div>
              <h3 className="font-roman text-[25px] font-semibold mb-4">{item.title}</h3>
              <p className="font-roman text-[16px] sm:text-base">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Importance;
