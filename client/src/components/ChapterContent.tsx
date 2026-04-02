import { Copy, Check, BookOpen, Code2, FileText } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";

interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  sections: {
    id: string;
    title: string;
    content: string;
    code?: string;
    codeLanguage?: string;
  }[];
}

interface ChapterContentProps {
  chapter: Chapter;
}

export default function ChapterContent({ chapter }: ChapterContentProps) {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const copyToClipboard = (code: string, sectionId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(sectionId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chapter Header */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Chapter Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 dark:border dark:border-white/15"
          whileHover={{ scale: 1.02 }}
        >
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Chương {chapter.number}
          </span>
        </motion.div>

        {/* Title — ép màu dark mode (tránh chữ xám đậm trên nền tím) */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-zinc-950 dark:text-zinc-50 mb-4 leading-tight">
          {chapter.title}
        </h1>

        {/* Description */}
        <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
          {chapter.description}
        </p>

        {/* Gradient Accent Line */}
        <motion.div
          className="mt-8 h-1.5 w-24 rounded-full bg-gradient-to-r from-primary via-accent to-chart-3"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
      </motion.div>

      {/* Sections */}
      <motion.div
        className="space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {chapter.sections.map((section, index) => (
          <SectionContent
            key={section.id}
            section={section}
            index={index}
            totalSections={chapter.sections.length}
            itemVariants={itemVariants}
            onCopyCode={copyToClipboard}
            copiedCodeId={copiedCodeId}
          />
        ))}
      </motion.div>
    </div>
  );
}

interface SectionContentProps {
  section: Chapter["sections"][0];
  index: number;
  totalSections: number;
  itemVariants: any;
  onCopyCode: (code: string, id: string) => void;
  copiedCodeId: string | null;
}

function SectionContent({
  section,
  index,
  totalSections,
  itemVariants,
  onCopyCode,
  copiedCodeId,
}: SectionContentProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      key={section.id}
      className="scroll-mt-24"
      variants={itemVariants}
    >
      {/* Section Card */}
      <motion.div
        className="glass rounded-3xl p-6 md:p-8 shadow-card hover:shadow-glow transition-shadow duration-300 dark:border dark:border-white/12 dark:bg-zinc-900/55"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Section Header */}
        <div className="flex items-start gap-4 mb-6">
          {/* Section Number */}
          <motion.div
            className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-glow"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {index + 1}
          </motion.div>

          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-heading text-zinc-950 dark:text-zinc-50 mb-2">
              {section.title}
            </h2>
            <div className="w-12 h-0.5 rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>
        </div>

        {/* Section Content */}
        <motion.div
          className="max-w-none"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-start gap-3 text-base text-zinc-700 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
            <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <p>{section.content}</p>
          </div>
        </motion.div>

        {/* Code Block */}
        {section.code && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Code Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {section.codeLanguage || "Code"}
                </span>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-3 rounded-lg hover:bg-primary/10 transition-colors"
                  onClick={() => onCopyCode(section.code!, section.id)}
                >
                  {copiedCodeId === section.id ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="ml-2 text-xs">
                    {copiedCodeId === section.id ? "Copied!" : "Copy"}
                  </span>
                </Button>
              </motion.div>
            </div>

            {/* Code Content */}
            <div className="rounded-2xl overflow-hidden border border-border/50 dark:border-white/10 shadow-inner bg-zinc-950/80">
              <pre className="p-5 overflow-x-auto">
                <code
                  style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}
                  className="text-sm text-slate-100 leading-relaxed"
                >
                  {section.code}
                </code>
              </pre>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Section Divider */}
      {index < totalSections - 1 && (
        <motion.div
          className="flex items-center justify-center py-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-4 text-zinc-400 dark:text-zinc-500">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-current" />
            <span className="text-xs font-medium">Tiếp theo</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-current" />
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
