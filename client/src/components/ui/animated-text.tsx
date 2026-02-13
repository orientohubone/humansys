import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  firstPart: string;
  animatedWords: string[];
  lastPart: string;
  className?: string;
  interval?: number;
}

function AnimatedText({
  firstPart,
  animatedWords,
  lastPart,
  className = "",
  interval = 2500,
}: AnimatedTextProps) {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setWordIndex((prevIndex) =>
        prevIndex === animatedWords.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);
    return () => clearTimeout(timeoutId);
  }, [wordIndex, animatedWords, interval]);

  return (
    <div className={`w-full text-center ${className}`}>
      {/* Texto principal - "Transforme sua" */}
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
        {firstPart}
      </div>

      {/* Container para palavra animada */}
      <div 
        className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight mt-2"
        style={{ minHeight: "1.2em" }}
      >
        {animatedWords.map((word, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 flex items-center justify-center text-primary font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={
              wordIndex === index
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: wordIndex > index ? -20 : 20 }
            }
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 20,
              duration: 0.4,
            }}
          >
            {word}
          </motion.div>
        ))}
      </div>

      {/* Subtítulo - "com Inteligência Artificial" */}
      <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mt-4 text-muted-foreground font-medium">
        {lastPart}
      </div>
    </div>
  );
}

export { AnimatedText };