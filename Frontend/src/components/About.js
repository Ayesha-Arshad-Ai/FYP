import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  // Motion Variants for Animated Text and Image
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section id="aboutus" className="py-20 bg-gray-100 text-gray-800">
      <div className="container mx-auto text-center">
        {/* About Title */}
        <motion.h2
          className="font-roman text-[40px] font-bold mb-12"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          About Us
        </motion.h2>

        {/* About Content */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-10">

          {/* Text Content */}
          <motion.div
            className="text-center md:text-left max-w-2xl"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="font-roman text-[16px] sm:text-base md:text-lg mb-6">
              "At CyberShield, our mission is to safeguard your online presence by providing cutting-edge cybersecurity solutions.
              We specialize in securing social media platforms and protecting user interactions, such as comments, posts, and media uploads,
              from emerging cyber threats. Our goal is to ensure your digital experience is safe, secure, and private."
            </p>
            <p className="font-roman text-[16px] sm:text-base md:text-lg">
              We are passionate about creating a secure online environment where individuals and businesses can interact, share, and connect without the fear of cyber threats.
            </p>
          </motion.div>

          {/* Team Photo or Illustration */}
          <motion.div
            className="w-full sm:w-1/2 md:w-1/3"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <img
              src="/assests/images/about.jpg"  // Replace this path with your own team photo or illustration
              alt="Our Professional Team"
              className="w-full rounded-lg shadow-xl"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
