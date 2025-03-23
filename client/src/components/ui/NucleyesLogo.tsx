import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const NucleyesLogo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Nucleus (center) */}
        <circle cx="50" cy="50" r="15" className="fill-primary" />
        
        {/* Electron orbits */}
        <ellipse
          cx="50"
          cy="50"
          rx="45"
          ry="25"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.7"
          fill="none"
          transform="rotate(30, 50, 50)"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="45"
          ry="25"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.7"
          fill="none"
          transform="rotate(90, 50, 50)"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="40"
          ry="20"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.5"
          fill="none"
          transform="rotate(150, 50, 50)"
        />
        
        {/* Electrons */}
        <circle cx="95" cy="50" r="4" className="fill-primary" />
        <circle cx="50" cy="75" r="4" className="fill-primary" />
        <circle cx="15" cy="35" r="4" className="fill-primary" />
      </svg>
    </div>
  );
};

interface LogoWithTextProps extends LogoProps {
  showText?: boolean;
}

export const NucleyesLogoWithText: React.FC<LogoWithTextProps> = ({ 
  className = "", 
  size = 40,
  showText = true
}) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <NucleyesLogo size={size} />
      {showText && (
        <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          nucleyes
        </span>
      )}
    </div>
  );
};