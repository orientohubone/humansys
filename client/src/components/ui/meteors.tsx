import { cn } from "@/lib/utils";
import React from "react";

export const Meteors = ({
  number,
  className,
  slow = false,
}: {
  number?: number;
  className?: string;
  slow?: boolean;
}) => {
  const meteors = new Array(number || 20).fill(true);
  return (
    <>
      {meteors.map((el, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-emerald-400 shadow-[0_0_0_1px_#10b98110] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-emerald-400 before:to-transparent",
            className
          )}
          style={{
            top: Math.floor(Math.random() * 100) + "%",
            left: Math.floor(Math.random() * 100) + "%",
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
            animationDuration: slow ? Math.floor(Math.random() * (30 - 15) + 15) + "s" : Math.floor(Math.random() * (10 - 2) + 2) + "s",
          }}
        />
      ))}
    </>
  );
};

export const Stars = ({
  number = 50,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const stars = new Array(number).fill(true);
  return (
    <>
      {stars.map((_, idx) => (
        <span
          key={"star" + idx}
          className={cn(
            "absolute animate-twinkle rounded-full bg-emerald-300",
            className
          )}
          style={{
            top: Math.floor(Math.random() * 100) + "%",
            left: Math.floor(Math.random() * 100) + "%",
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            animationDelay: Math.random() * 3 + "s",
            animationDuration: Math.random() * 3 + 2 + "s",
          }}
        />
      ))}
    </>
  );
};