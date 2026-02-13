
"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const NeuralBackground = ({
  className,
  intensity = "medium",
}: {
  className?: string;
  intensity?: "light" | "medium" | "strong";
}) => {
  const opacityMap = {
    light: 0.1,
    medium: 0.2,
    strong: 0.4,
  };

  const opacity = opacityMap[intensity];

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 800"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="neural1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={opacity} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={opacity} />
          </linearGradient>
          <linearGradient id="neural2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={opacity} />
            <stop offset="100%" stopColor="#ec4899" stopOpacity={opacity} />
          </linearGradient>
          <linearGradient id="neural3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity={opacity} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={opacity} />
          </linearGradient>
        </defs>

        {/* Linhas neurais animadas */}
        <motion.path
          d="M0 400C200 400 300 350 500 380C700 410 800 360 1000 390C1100 400 1200 380 1200 380"
          stroke="url(#neural1)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 0], 
            opacity: [0, opacity, 0] 
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.path
          d="M0 450C250 440 350 480 550 460C750 440 850 490 1050 470C1150 460 1200 450 1200 450"
          stroke="url(#neural2)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 0], 
            opacity: [0, opacity, 0] 
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <motion.path
          d="M0 350C180 360 280 320 480 340C680 360 780 320 980 340C1080 350 1200 330 1200 330"
          stroke="url(#neural3)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 0], 
            opacity: [0, opacity, 0] 
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Pontos de conexão */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={i}
            cx={150 + i * 140}
            cy={300 + Math.sin(i) * 100}
            r="2"
            fill="#3b82f6"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, opacity * 2, 0], 
              scale: [0, 1, 0] 
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </svg>
    </div>
  );
};
