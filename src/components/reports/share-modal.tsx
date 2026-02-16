"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Link } from "lucide-react";
import { generateShareToken } from "@/app/(dashboard)/reports/actions";

interface ShareModalProps {
  reportId: string | null;
  onClose: () => void;
}

export default function ShareModal({ reportId, onClose }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [expires, setExpires] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(async () => {
    if (!reportId) return;
    setLoading(true);
    setCopied(false);
    setShareUrl(null);

    const result = await generateShareToken(reportId);
    if (result.token) {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      setShareUrl(`${origin}/reports/share/${result.token}`);
      setExpires(result.expires ?? null);
    }
    setLoading(false);
  }, [reportId]);

  useEffect(() => {
    if (reportId) {
      generate();
    }
  }, [reportId, generate]);

  async function handleCopy() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <AnimatePresence>
      {reportId && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link size={16} className="text-gold" />
                <h3 className="text-sm font-medium text-text-primary">
                  Share Report
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-text-muted transition-colors hover:bg-background hover:text-text-primary"
              >
                <X size={16} />
              </button>
            </div>

            {loading ? (
              <div className="py-6 text-center text-sm text-text-muted">
                Generating share link...
              </div>
            ) : shareUrl ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-transparent text-xs text-text-primary outline-none"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  />
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 rounded-md bg-gold px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                {expires && (
                  <p className="text-xs text-text-muted">
                    This link expires in 7 days. Anyone with the link can view
                    this report without signing in.
                  </p>
                )}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-negative">
                Failed to generate share link. Please try again.
              </p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
