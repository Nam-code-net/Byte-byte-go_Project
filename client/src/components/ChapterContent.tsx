import { Copy, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chapter Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-600 rounded-full text-xs font-bold mb-4 border border-blue-200"
          whileHover={{ scale: 1.05 }}
        >
          CHƯƠNG {chapter.number}
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
          {chapter.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {chapter.description}
        </p>
      </motion.div>

      {/* Accent Bar */}
      <motion.div
        className="h-1 bg-gradient-to-r from-blue-500 via-green-500 to-slate-600 rounded-full mb-12"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      />

      {/* Sections */}
      <motion.div
        className="space-y-16"
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
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      key={section.id}
      className="scroll-mt-20"
      variants={itemVariants}
    >
      {/* Section Title */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
          {section.title}
        </h2>
        <motion.div
          className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
      </motion.div>

      {/* Section Content */}
      <motion.div
        className="prose prose-sm max-w-none mb-8"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <p className="text-base text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {section.content}
        </p>
      </motion.div>

      {/* Code Block */}
      {section.code && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
            {/* Code Header */}
            <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {section.codeLanguage || "code"}
              </span>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200 transition-colors"
                  onClick={() => onCopyCode(section.code!, section.id)}
                >
                  {copiedCodeId === section.id ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Code Content */}
            <pre className="p-4 overflow-x-auto">
              <code
                style={{ fontFamily: '"Fira Code", monospace' }}
                className="text-sm text-slate-100 leading-relaxed"
              >
                {section.code}
              </code>
            </pre>
          </div>
        </motion.div>
      )}

      {/* Divider */}
      {index < totalSections - 1 && (
        <motion.div
          className="my-12 border-t border-border"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
      )}
    </motion.section>
  );
}
