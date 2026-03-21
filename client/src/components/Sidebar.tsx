import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/useMobile";

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

export default function Sidebar({
  courses,
  activeChapterId,
  onChapterSelect,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { duration: 0.3 } },
    exit: { x: "-100%", transition: { duration: 0.3 } },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.div
        className="md:hidden fixed top-4 left-4 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="bg-white shadow-lg hover:bg-slate-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </motion.div>

      {/* Sidebar */}
      <motion.aside
        className="fixed md:relative w-[86vw] max-w-80 md:w-80 h-screen bg-sidebar/95 text-sidebar-foreground border-r border-sidebar-border overflow-y-auto transition-transform duration-300 z-40 backdrop-blur-sm"
        variants={sidebarVariants}
        initial={isMobile ? "hidden" : "visible"}
        animate={isMobile ? (isOpen ? "visible" : "hidden") : "visible"}
      >
        {/* Header */}
        <motion.div
          className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 p-6 border-b border-sidebar-border shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-md"
              whileHover={{ rotate: 10 }}
            >
              <BookOpen className="w-6 h-6 text-blue-600" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white font-display">
                ByteByteGo
              </h1>
              <p className="text-xs text-blue-100">Pro Masterclass</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Courses */}
        <nav className="p-4 space-y-6">
          {courses.map((course, courseIdx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + courseIdx * 0.1 }}
            >
              <h2 className="text-sm font-bold text-sidebar-foreground/70 uppercase tracking-wider mb-3 px-2">
                {course.title}
              </h2>
              <ul className="space-y-1">
                {course.chapters.map((chapter, chapterIdx) => (
                  <motion.li
                    key={chapter.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.25 + courseIdx * 0.1 + chapterIdx * 0.05,
                    }}
                  >
                    <motion.button
                      onClick={() => {
                        onChapterSelect(chapter.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                        activeChapterId === chapter.id
                          ? "bg-blue-500 text-white font-semibold shadow-md ring-2 ring-blue-300/50"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/80"
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-xs font-bold mr-2 opacity-60">
                        {String(chapter.number).padStart(2, "0")}
                      </span>
                      {chapter.title}
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 md:hidden z-30"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
