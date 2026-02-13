import React from 'react';
import { motion } from 'framer-motion';

interface DISCCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  borderGradient: string;
  iconBg: string;
  delay: number;
}

// Sparkles effect - decorative elements
const Sparkles: React.FC<{ count?: number; gradient: string }> = ({ count = 8, gradient }) => {
  const sparklePositions = Array.from({ length: count }).map((_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
  }));

  return (
    <>
      {sparklePositions.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute w-1 h-1 rounded-full opacity-60"
          style={{
            top: `${sparkle.top}%`,
            left: `${sparkle.left}%`,
            background: 'white',
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
          }}
        />
      ))}
    </>
  );
};

export const DISCCard: React.FC<DISCCardProps> = ({
  title,
  description,
  icon,
  gradient,
  borderGradient,
  iconBg,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="group relative h-full"
    >
      {/* Card with gradient background */}
      <div
        className={`relative h-full rounded-3xl p-6 xs:p-5 sm:p-6 md:p-8 overflow-hidden border-2 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105 ${gradient} ${borderGradient}`}
      >
        {/* Sparkle effects */}
        <Sparkles count={12} gradient={gradient} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Icon */}
          <div className={`${iconBg} inline-flex w-12 h-12 xs:w-14 xs:h-14 rounded-2xl items-center justify-center mb-4 xs:mb-5 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-xl xs:text-2xl">
              {icon}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl xs:text-2xl font-bold text-white mb-2 xs:mb-3">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm xs:text-base text-white/90 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-500"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
          }}
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />

        <motion.div
          className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 blur-3xl -ml-16 -mb-16"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        />
      </div>
    </motion.div>
  );
};
