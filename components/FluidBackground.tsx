
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const StarField = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.4 + 0.1
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white will-change-[opacity,transform]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            transform: 'translateZ(0)'
          }}
          initial={{ opacity: star.opacity, scale: 1 }}
          animate={{
            opacity: [star.opacity, star.opacity * 2, star.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#09090b]">
      
      <StarField />

      {/* Primary Glow: Volt */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[120vw] h-[100vw] bg-[#d9ff00] rounded-full mix-blend-overlay filter blur-[120px] opacity-10 will-change-transform"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Secondary Glow: Slate/Gray */}
      <motion.div
        className="absolute bottom-[-30%] right-[-10%] w-[100vw] h-[100vw] bg-[#27272a] rounded-full mix-blend-screen filter blur-[150px] opacity-40 will-change-transform"
        animate={{
          x: [0, -80, 40, 0],
          y: [0, 80, -40, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Subtle Racing Orange Hint */}
      <motion.div
        className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] bg-[#f97316] rounded-full mix-blend-screen filter blur-[100px] opacity-5 will-change-transform"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />
    </div>
  );
};

export default FluidBackground;
