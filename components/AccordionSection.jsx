"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function AccordionSection({ titulo, icon, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0);
    }
  }, [open]);

  return (
    <div className="border-b border-line last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full py-4 text-left group"
      >
        {icon && <span className="text-muted shrink-0">{icon}</span>}
        <span className="font-600 text-sm text-ink flex-1">{titulo}</span>
        <ChevronDown
          size={16}
          className="text-muted transition-transform duration-300 ease-out"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: height }}
      >
        <div ref={contentRef} className="pb-5">
          {children}
        </div>
      </div>
    </div>
  );
}
