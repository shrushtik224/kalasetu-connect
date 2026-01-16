import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: { icon: 32, text: "text-xl" },
    md: { icon: 48, text: "text-2xl" },
    lg: { icon: 64, text: "text-4xl" },
  };

  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Bridge/Arch Icon */}
      <svg
        width={sizes[size].icon}
        height={sizes[size].icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        {/* Arch/Bridge */}
        <path
          d="M8 48C8 48 8 28 32 28C56 28 56 48 56 48"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left pillar */}
        <path
          d="M12 48V56"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Right pillar */}
        <path
          d="M52 48V56"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Center decoration */}
        <circle
          cx="32"
          cy="20"
          r="4"
          fill="currentColor"
        />
        {/* Decorative elements */}
        <path
          d="M24 36C24 36 28 32 32 32C36 32 40 36 40 36"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-serif font-bold ${sizes[size].text} text-primary leading-none`}>
            KalaSetu
          </span>
          {size !== "sm" && (
            <span className="text-xs text-muted-foreground tracking-wider uppercase">
              Bridging Heritage to Home
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Logo;
