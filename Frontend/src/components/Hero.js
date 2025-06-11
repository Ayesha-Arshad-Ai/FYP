import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation

const Hero = () => {
  return (
    <div className="dark:text-white duration-300 min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Background gradient */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(to right, #bbd2c5, #536976)", // Updated background gradient colors
        }}
      ></div>

      {/* Smooth wave shape at the bottom */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px]"
        style={{
          backgroundColor: "#000000",
          clipPath: "path('M0,100 Q600,200 1200,100 T2400,100 V300 H0 Z')", // adjusted for a smooth wave
        }}
      ></div>

      <div className="container relative z-10 mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center pt-20 sm:pt-32 pb-10 sm:pb-20">
        {/* Text section */}
        <div className="space-y-5 order-1 sm:order-1 xl:pr-40">
          <h1
            data-aos="fade-up"
            className="font-roman text-[40px] font-bold"
            style={{ lineHeight: 1.2 }}
          >
            <span style={{ fontSize: "0.8em" }}>
              AI-Powered Cyber Shield for Safe Digital Engagement
            </span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="300"
            className="font-roman text-[16px]"
          >
            Cyber Shield enhances online safety by using AI to authenticate, analyze, and prevent cyberbullying. It blocks harmful comments, enabling safe interactions, and allows users to chat with an intelligent bot. The app also analyzes posts and images, identifying and filtering harmful content while generating safe, creative visuals.
          </p>

          {/* Button with link to the login page */}
          <Link to="/login"> {/* Assuming React Router is used */}
            <button
              data-aos="fade-up"
              data-aos-delay="500"
              data-aos-offset="0"
              className="btn-grad"
            >
              Explore Social App
            </button>
          </Link>
        </div>

        {/* Image section */}
        <div className="border-4 border-gray-200 p-4 w-full max-w-sm lg:max-w-md">
          <img
            src="/assests/images/avatar.png"
            alt="Trendy Men's Clothing"
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
