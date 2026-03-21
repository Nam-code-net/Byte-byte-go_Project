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
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed right-4 top-4 z-50"
    >
      <Button
        type="button"
        variant="outline"
        onClick={toggleTheme}
        className="h-10 rounded-full border-border/70 bg-background/80 px-3 shadow-lg backdrop-blur-md"
        aria-label="Toggle color theme"
      >
        {isDark ? (
          <>
            <Sun className="size-4 text-amber-400" />
            <span className="text-xs">Light</span>
          </>
        ) : (
          <>
            <Moon className="size-4 text-blue-600" />
            <span className="text-xs">Dark</span>
          </>
        )}
      </Button>
    </motion.div>
  );
}
