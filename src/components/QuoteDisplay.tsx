import React from 'react';
import { motion } from 'framer-motion';

interface QuoteProps {
  text: string;
  attribution: string;
  backgroundImage: string;
}

const QuoteDisplay: React.FC<QuoteProps> = ({ text, attribution, backgroundImage }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center text-center px-6">
      {/* Background Image with Blur Placeholder Effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Dark Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-2xl"
      >
        <h1 className="font-['Jaldi'] text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
          "{text}"
        </h1>
        
        <p className="font-['Funnel_Sans'] text-lg md:text-xl text-white/80 font-light uppercase tracking-widest">
          — {attribution}
        </p>
      </motion.div>
    </div>
  );
};

export default QuoteDisplay;
