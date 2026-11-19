"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  variant?: "dark" | "light" | "pill-light";
  disabled?: boolean;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Pilih opsi...",
  variant = "dark",
  disabled = false,
  className = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const triggerClass =
    variant === "pill-light"
      ? "h-[38px] px-3.5 rounded-full bg-[#F1E6D8] border border-[#201914]/15 text-[#201914] text-[12px] font-medium hover:border-[#201914]/35"
      : variant === "light"
      ? "h-[46px] px-4 rounded-[14px] bg-white border border-[#201914]/15 text-[#201914] text-[14px] hover:border-[#201914]/35"
      : "h-[48px] px-4 rounded-[14px] bg-white/[0.06] border border-white/[0.1] text-[#F1E6D8] text-[14px] hover:bg-white/[0.09] hover:border-white/[0.2]";

  const menuClass =
    variant === "dark"
      ? "bg-[#201914] border border-white/[0.12] text-[#F1E6D8]"
      : "bg-white border border-[#201914]/12 text-[#201914]";

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`w-full font-inter flex items-center justify-between gap-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D4A359]/40 disabled:opacity-50 disabled:cursor-not-allowed ${triggerClass} ${
          open ? "border-[#D4A359]" : ""
        }`}
      >
        <span className="truncate text-left">
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="opacity-50">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            variant === "dark" ? "text-[#D4A359]" : "text-[#201914]/65"
          } ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={listboxId}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
            className={`absolute left-0 right-0 mt-2 z-50 rounded-[18px] p-1.5 shadow-2xl max-h-60 overflow-y-auto overscroll-contain min-w-[200px] ${menuClass}`}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-[12px] font-inter text-[13px] flex items-center justify-between gap-2 transition-colors ${
                    variant === "dark"
                      ? isSelected
                        ? "bg-[#D4A359]/20 text-[#F1E6D8] font-medium"
                        : "text-[#F1E6D8]/80 hover:bg-white/[0.08] hover:text-white"
                      : isSelected
                      ? "bg-[#201914] text-[#F1E6D8] font-medium"
                      : "text-[#201914]/85 hover:bg-[#F1E6D8]"
                  }`}
                >
                  <div className="min-w-0">
                    <span className="block truncate">{opt.label}</span>
                    {opt.description && (
                      <span
                        className={`block text-[11px] truncate ${
                          isSelected
                            ? variant === "dark"
                              ? "text-[#D4A359]"
                              : "text-[#F1E6D8]/75"
                            : "opacity-55"
                        }`}
                      >
                        {opt.description}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 shrink-0 ${
                        variant === "dark" ? "text-[#D4A359]" : "text-[#D4A359]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

