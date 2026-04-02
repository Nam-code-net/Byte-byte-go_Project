import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme, switchable } = useTheme();

  if (!switchable || !toggleTheme) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="fixed right-4 top-4 z-[60]"
    >
      <motion.button
        type="button"
        onClick={toggleTheme}
        className="
          relative w-14 h-14 rounded-2xl
          glass shadow-glow
          flex items-center justify-center
          overflow-hidden
          group
        "
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle color theme"
      >
        {/* Background Glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: isDark 
              ? "linear-gradient(135deg, hsl(250 100% 72% / 0.2), hsl(330 100% 72% / 0.2))"
              : "linear-gradient(135deg, hsl(250 100% 65% / 0.2), hsl(330 100% 65% / 0.2))",
          }}
        />

        {/* Sun Icon */}
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 0 : 1,
            rotate: isDark ? -90 : 0,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute"
        >
          <Sun className="w-6 h-6 text-amber-500" />
        </motion.div>

        {/* Moon Icon */}
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 1 : 0,
            rotate: isDark ? 0 : 90,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute"
        >
          <Moon className="w-6 h-6 text-violet-400" />
        </motion.div>

        {/* Hover Ring Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-colors duration-300"
          initial={false}
        />
      </motion.button>
    </motion.div>
  );
}
