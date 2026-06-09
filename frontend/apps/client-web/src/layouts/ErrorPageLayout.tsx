import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ErrorPageLayoutProps {
  canvas: ReactNode;
  glowClassName: string;

  code: string;
  codeClassName: string;

  title: string;
  description: string;

  middleContent?: ReactNode;
  actions: ReactNode;
  footer: ReactNode;

  showGrid?: boolean;
}

export default function ErrorPageLayout({
  canvas,
  glowClassName,

  code,
  codeClassName,

  title,
  description,

  middleContent,
  actions,
  footer,

  showGrid = false,
}: ErrorPageLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-foreground transition-colors duration-500">
      {canvas}

      <div className={glowClassName} />

      {showGrid && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-30 dark:opacity-100" />
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 text-center"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className={codeClassName}
        >
          {code}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-3xl font-bold tracking-tight md:text-5xl"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg"
        >
          {description}
        </motion.p>

        {middleContent}

        {actions}

        {footer}
      </motion.div>
    </div>
  );
}
