import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <footer className="bg-gradient-to-r from-[#bbd2c5] to-[#536976] text-white py-16">
      <div className="container mx-auto text-center">
        {/* Footer Content */}
        <motion.div
          className="flex flex-wrap justify-between gap-12 md:gap-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Footer Links */}
          <motion.div className="space-y-4 text-lg md:w-1/4" variants={itemVariants}>
            <h3 className="font-roman text-[30px] font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
               <li><a href="#privacy-policy" className="text-[15px] hover:text-gray-300">Privacy Policy</a></li>
              <li><a href="#terms" className="text-[15px] hover:text-gray-300">Terms of Service</a></li>
              <li><a href="#contact" className="text-[15px] hover:text-gray-300">Contact Us</a></li>
            </ul>
          </motion.div>

          {/* Social Media Links */}
          <motion.div className="space-y-4 text-lg md:w-1/4" variants={itemVariants}>
            <h3 className="font-roman text-[30px] font-bold mb-4">Follow Us</h3>
            <div className="flex justify-center gap-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                <i className="fab fa-facebook fa-lg"></i> {/* Adjusted size for icons */}
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                <i className="fab fa-twitter fa-lg"></i> {/* Adjusted size for icons */}
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                <i className="fab fa-instagram fa-lg"></i> {/* Adjusted size for icons */}
              </a>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div className="space-y-4 text-lg md:w-1/4" variants={itemVariants}>
            <h3 className="font-roman text-[30px] font-bold mb-4">Contact Us</h3>
            <p className="font-roman text-[15px]">
              Email: support@cybershield.com
            </p>
            <p className="font-roman text-[15px]">
              Phone: +1 (800) 123-4567
            </p>
          </motion.div>

        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
