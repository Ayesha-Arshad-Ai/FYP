import React from "react";
import { motion } from "framer-motion";

const Highlight = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Staggering animations of child elements
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } },
  };

  return (
    <section className="relative bg-gradient-to-r from-[#bbd2c5] to-[#536976] text-white py-16 px-4">
      {/* Highlight Content */}
      <motion.div
        className="container mx-auto flex flex-col-reverse lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Text Content */}
        <motion.div
          className="flex-1 space-y-6 text-center lg:text-left"
          variants={containerVariants} // Apply stagger animation to text content
        >
          <motion.h2
            className="dark:text-white duration-300 text-[50px] font-bold font-roman"
            variants={textVariants} // Apply text animation to h2
          >
            CyberShield
          </motion.h2>
          <motion.p
            className="dark:text-white duration-300 text-[16px] font-roman"
            variants={textVariants} // Apply text animation to p
          >
            CyberShield provides advanced cybersecurity solutions specifically designed for social media platforms. It ensures secure uploading of comments, posts, and other interactions, protecting users from potential threats while maintaining a safe online environment.
          </motion.p>
        </motion.div>

        {/* Image Box */}
        <motion.div
          className="flex-1 flex justify-center lg:justify-end"
          variants={imageVariants} // Apply image animation
        >
          <div className="border-4 border-gray-200 p-4 w-full max-w-sm lg:max-w-md">
            <img
              src="/assests/images/highlight.jpg"
              alt="Trendy Men's Clothing"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Highlight;
