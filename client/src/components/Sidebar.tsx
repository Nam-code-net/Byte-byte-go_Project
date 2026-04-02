import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Layers,
  Database,
  Code2,
  Server,
  Zap,
  Shield,
  Globe,
  Cpu,
  Lock,
  Network
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  chapters: {
    id: string;
    number: number;
    title: string;
  }[];
}

interface SidebarProps {
  courses: Course[];
  activeChapterId: string;
  onChapterSelect: (chapterId: string) => void;
}

const chapterIcons: Record<number, React.ReactNode> = {
  1: <Layers className="w-4 h-4" />,
  2: <Database className="w-4 h-4" />,
  3: <Code2 className="w-4 h-4" />,
  4: <Server className="w-4 h-4" />,
  5: <Zap className="w-4 h-4" />,
  6: <Shield className="w-4 h-4" />,
  7: <Globe className="w-4 h-4" />,
  8: <Cpu className="w-4 h-4" />,
  9: <Lock className="w-4 h-4" />,
  10: <Network className="w-4 h-4" />,
};

export default function Sidebar({
  courses,
  activeChapterId,
  onChapterSelect,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <motion.button
          className="fixed top-4 left-4 z-50 p-3 rounded-2xl glass shadow-glow"
          onClick={() => setIsMobileOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BookOpen className="w-5 h-5 text-primary" />
        </motion.button>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar: mobile = drawer trái; desktop = cột trái cố định trong layout */}
      <motion.aside
        className={cn(
          "top-0 z-50 flex h-screen flex-col overflow-hidden glass-strong shadow-card transition-[width] duration-200 ease-out",
          isMobile
            ? "fixed w-[min(88vw,20rem)] max-w-80"
            : "md:sticky md:shrink-0 md:self-start",
          !isMobile && (isCollapsed ? "md:w-20" : "md:w-[300px]")
        )}
        initial={isMobile ? { x: "-100%" } : false}
        animate={
          isMobile
            ? { x: isMobileOpen ? 0 : "-100%" }
            : { x: 0 }
        }
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
      >
        {/* Header */}
        <div className="relative p-5 border-b border-border/50">
          {/* Gradient Accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-chart-3" />
          
          <div className="flex items-center gap-3">
            {/* Logo */}
            <motion.div
              className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow"
              whileHover={{ rotate: 10, scale: 1.05 }}
            >
              <BookOpen className="w-6 h-6 text-white" />
            </motion.div>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <h1 className="font-display text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
                  ByteByteGo
                </h1>
                <p className="text-xs text-muted-foreground">System Design</p>
              </motion.div>
            )}

            {/* Collapse Toggle - Desktop Only */}
            {!isMobile && (
              <motion.button
                className="p-2 rounded-xl hover:bg-accent/10 transition-colors"
                onClick={() => setIsCollapsed(!isCollapsed)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                )}
              </motion.button>
            )}

            {/* Close Button - Mobile Only */}
            {isMobile && (
              <motion.button
                className="p-2 rounded-xl hover:bg-accent/10 transition-colors"
                onClick={() => setIsMobileOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Chapters List */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 md:px-1.5">
          {!isCollapsed && (
            <div className="mb-2 px-1.5">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Nội dung khóa học
              </h2>
            </div>
          )}

          <ul className="space-y-1">
            {courses.map((course) =>
              course.chapters.map((chapter) => {
                const isActive = activeChapterId === chapter.id;
                const icon = chapterIcons[chapter.number] || <Layers className="w-4 h-4" />;

                return (
                  <motion.li key={chapter.id}>
                    <motion.button
                      onClick={() => {
                        onChapterSelect(chapter.id);
                        if (isMobile) setIsMobileOpen(false);
                      }}
                      className={cn(
                        "group relative flex w-full items-center gap-2 rounded-xl py-2.5 pl-1.5 pr-2 text-left transition-all duration-200 md:gap-2.5 md:pl-1 md:pr-2",
                        isActive
                          ? "gradient-primary text-white shadow-glow"
                          : "text-zinc-800 hover:bg-accent/10 hover:text-zinc-950 dark:text-zinc-100 dark:hover:text-white"
                      )}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20"
                          layoutId="activeChapter"
                          transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={cn(
                          "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg md:h-9 md:w-9",
                          isActive
                            ? "bg-white/20"
                            : "bg-secondary group-hover:bg-primary/10"
                        )}
                      >
                        {icon}
                      </div>

                      {/* Text */}
                      {!isCollapsed && (
                        <div className="relative z-10 flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`
                              text-xs font-bold
                              ${isActive ? "text-white/80" : "text-zinc-500 dark:text-zinc-400"}
                            `}>
                              {String(chapter.number).padStart(2, "0")}
                            </span>
                            <span className="text-sm font-medium truncate">
                              {chapter.title}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Collapsed State Number */}
                      {isCollapsed && (
                        <span className={`
                          absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold
                          flex items-center justify-center
                          ${isActive 
                            ? "bg-white text-primary" 
                            : "bg-secondary text-muted-foreground"
                          }
                        `}>
                          {chapter.number}
                        </span>
                      )}
                    </motion.button>
                  </motion.li>
                );
              })
            )}
          </ul>
        </nav>

        {/* Footer Stats */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t border-border/50"
          >
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Chapters", value: "10+" },
                { label: "Hours", value: "25+" },
                { label: "Code", value: "50+" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-2 rounded-xl bg-secondary/50"
                >
                  <div className="text-lg font-bold gradient-text">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.aside>
    </>
  );
}
