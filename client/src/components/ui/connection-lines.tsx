
"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const transition = {
  duration: 2,
  ease: "easeInOut",
  repeat: Infinity,
  repeatType: "reverse" as const,
};

export const ConnectionLines = ({
  title,
  description,
  className,
  autoAnimate = true,
}: {
  title?: string;
  description?: string;
  className?: string;
  autoAnimate?: boolean;
}) => {
  const [pathLengths, setPathLengths] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    if (autoAnimate) {
      // Animar as linhas sequencialmente
      const timer = setTimeout(() => {
        setPathLengths([1, 1, 1, 1, 1]);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoAnimate]);

  return (
    <div className={cn("relative w-full h-[600px] overflow-hidden", className)}>
      {title && (
        <div className="relative z-10 text-center py-8">
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-800 to-gray-600">
            {title}
          </h2>
          {description && (
            <p className="text-sm md:text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}
      
      <svg
        width="100%"
        height="600"
        viewBox="0 0 1440 600"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Gradientes para as cores da HumanSys */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          
          <filter id="blurEffect">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* Linha 1 - Azul para Roxo */}
        <motion.path
          d="M0 450C145.5 450 191 453.265 269 434C326.5 417 339.5 408 397.5 353C439 318.5 455 316.5 490 310C509.664 306.348 521 290.736 538 291.236C553.591 291.236 562.429 301.739 584.66 309.749C592.042 312.408 600.2 313.237 607.356 310.019C624.755 302.195 641.446 283.324 657 283.735C673.408 283.735 693.545 306.572 712.903 313.769C718.727 315.934 725.184 315.395 730.902 312.965C751.726 304.115 764.085 284.106 782 283.735C794.831 283.47 804.103 295.859 822.469 305.515C835.13 312.171 850.214 313.815 862.827 307.069C875.952 300.049 889.748 289.706 903.5 290.736C922.677 292.171 935.293 297.562 945.817 302.673C954.234 306.76 963.095 309.792 972.199 311.954C996.012 317.611 1007.42 321.118 1034 336C1077.5 360.359 1082.5 381.5 1140 416C1206 457 1328.5 449.5 1440 449.5"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: pathLengths[0] }}
          transition={{ ...transition, delay: 0 }}
        />

        {/* Linha 2 - Roxo para Rosa */}
        <motion.path
          d="M0 374.5C147 374.5 277 374.5 310 360.5C348 350 392.5 330.5 408 322C434 310.5 426 313.235 479 302.235C494 299.729 523 297.435 534.5 299.735C554.5 303.735 555.5 310.235 576 310.735C592 310.735 616 283.735 633 284.235C648.671 284.235 661.31 302.052 684.774 311.942C692.004 314.989 700.2 315.738 707.349 312.505C724.886 304.575 741.932 285.33 757.5 285.742C773.864 285.742 791.711 307.623 810.403 314.654C816.218 316.841 822.661 316.246 828.451 313.991C849.246 305.893 861.599 289.112 879.5 288.742C886.47 288.597 896.865 293.047 907.429 297.911C930.879 308.707 957.139 306.639 982.951 307.063C1020.91 307.686 1037.5 317.797 1056.5 324C1102.24 343.627 1116.5 357.704 1180.5 366.235C1257.5 376.5 1279 374 1440 375"
          stroke="url(#gradient2)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: pathLengths[1] }}
          transition={{ ...transition, delay: 0.2 }}
        />

        {/* Linha 3 - Rosa para Laranja */}
        <motion.path
          d="M0 301C147.5 301.333 294.5 300.735 380.5 300.735C405.976 301.94 422.849 302.228 436.37 302.123C477.503 301.803 518.631 293.605 559.508 298.197C564.04 298.706 569.162 299.524 575 300.735C588 303.433 616 308.702 627.5 306.402C647.5 302.402 659 286.235 680.5 286.235C700.5 286.235 725 316.235 742 315.735C757.654 315.735 768.77 297.583 791.793 287.59C798.991 284.465 807.16 283.777 814.423 286.745C832.335 294.064 850.418 311.648 866 311.235C882.791 311.235 902.316 296.786 921.814 292.392C926.856 291.255 932.097 291.674 937.176 292.631C966.993 298.248 970.679 301.346 989.5 301.735C1006.3 302.083 1036.5 300.235 1055.5 300.235C1114.5 300.235 1090.5 300.235 1124 300.235C1177.5 300.235 1178.99 301.402 1241 301.402C1317.5 301.402 1274.5 299.568 1440 300.235"
          stroke="url(#gradient3)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: pathLengths[2] }}
          transition={{ ...transition, delay: 0.4 }}
        />

        {/* Linha 4 - Laranja para Verde */}
        <motion.path
          d="M0 225.5C150.5 225.5 261 225.318 323.5 243.5C351 251.5 387.517 271.001 423.5 281.5C447.371 288.465 472 290.735 487 294.735C503.786 299.212 504.5 303.808 523 305.735C547 308.235 564.814 288.235 584.5 288.235C604.5 288.235 626 316.069 643 315.569C658.676 315.569 672.076 298.63 695.751 288.972C703.017 286.008 711.231 285.208 718.298 288.617C735.448 296.889 751.454 316.98 767 316.569C783.364 316.569 801.211 294.687 819.903 287.657C825.718 285.469 832.141 286.104 837.992 288.194C859.178 295.764 873.089 310.365 891 310.735C907.8 311.083 923 291.235 963 293.735C1034.5 293.735 1047.5 279.68 1071 268.5C1122.5 244 1142.23 239.871 1185 233.5C1255.5 223 1294 226 1439.5 226"
          stroke="url(#gradient4)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: pathLengths[3] }}
          transition={{ ...transition, delay: 0.6 }}
        />

        {/* Linha 5 - Verde para Azul */}
        <motion.path
          d="M0.5 151C145.288 149.349 195 148.5 265.5 165C322 178.223 399.182 244.5 411 254.5C424.176 265.649 456.916 278.677 496.259 289.699C498.746 290.396 501.16 291.304 503.511 292.374C517.104 298.558 541.149 307.911 551.5 308.236C571.5 308.236 590 285.736 611.5 285.736C631.5 285.736 652.5 316.236 669.5 315.736C685.171 315.736 697.81 297.924 721.274 288.036C728.505 284.988 736.716 284.231 743.812 287.579C761.362 295.857 778.421 316.148 794 315.736C810.375 315.736 829.35 295.68 848.364 289.179C854.243 287.169 860.624 287.802 866.535 289.718C886.961 296.338 898.141 306.866 916 307.236C932.8 307.583 934.5 297.236 967.5 288.736C1011.5 278 1007.5 280.5 1029.5 267C1069.5 240.5 1072 227.442 1128.5 190.5C1180.5 156.5 1275 147.374 1439 151"
          stroke="url(#gradient5)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: pathLengths[4] }}
          transition={{ ...transition, delay: 0.8 }}
        />

        {/* Versões blur para efeito de profundidade */}
        <path
          d="M0 450C145.5 450 191 453.265 269 434C326.5 417 339.5 408 397.5 353C439 318.5 455 316.5 490 310C509.664 306.348 521 290.736 538 291.236C553.591 291.236 562.429 301.739 584.66 309.749C592.042 312.408 600.2 313.237 607.356 310.019C624.755 302.195 641.446 283.324 657 283.735C673.408 283.735 693.545 306.572 712.903 313.769C718.727 315.934 725.184 315.395 730.902 312.965C751.726 304.115 764.085 284.106 782 283.735C794.831 283.47 804.103 295.859 822.469 305.515C835.13 312.171 850.214 313.815 862.827 307.069C875.952 300.049 889.748 289.706 903.5 290.736C922.677 292.171 935.293 297.562 945.817 302.673C954.234 306.76 963.095 309.792 972.199 311.954C996.012 317.611 1007.42 321.118 1034 336C1077.5 360.359 1082.5 381.5 1140 416C1206 457 1328.5 449.5 1440 449.5"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
          filter="url(#blurEffect)"
        />
        
        <path
          d="M0 374.5C147 374.5 277 374.5 310 360.5C348 350 392.5 330.5 408 322C434 310.5 426 313.235 479 302.235C494 299.729 523 297.435 534.5 299.735C554.5 303.735 555.5 310.235 576 310.735C592 310.735 616 283.735 633 284.235C648.671 284.235 661.31 302.052 684.774 311.942C692.004 314.989 700.2 315.738 707.349 312.505C724.886 304.575 741.932 285.33 757.5 285.742C773.864 285.742 791.711 307.623 810.403 314.654C816.218 316.841 822.661 316.246 828.451 313.991C849.246 305.893 861.599 289.112 879.5 288.742C886.47 288.597 896.865 293.047 907.429 297.911C930.879 308.707 957.139 306.639 982.951 307.063C1020.91 307.686 1037.5 317.797 1056.5 324C1102.24 343.627 1116.5 357.704 1180.5 366.235C1257.5 376.5 1279 374 1440 375"
          stroke="url(#gradient2)"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
          filter="url(#blurEffect)"
        />
      </svg>
    </div>
  );
};
