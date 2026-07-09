"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

export default function ImageGallery({ fotos, titulo }) {
  const [selected, setSelected] = useState(0);
  const [erro, setErro] = useState(false);

  if (!fotos || fotos.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-line aspect-[16/10] flex items-center justify-center">
        <div className="text-center">
          <ImageOff size={40} className="text-muted mx-auto mb-2" />
          <p className="text-sm text-muted">Nenhuma foto disponível</p>
        </div>
      </div>
    );
  }

  const prev = () => setSelected((s) => (s - 1 + fotos.length) % fotos.length);
  const next = () => setSelected((s) => (s + 1) % fotos.length);

  return (
    <div className="bg-white rounded-xl border border-line overflow-hidden">
      {/* Imagem principal */}
      <div className="relative aspect-[16/10] bg-sand/50">
        {erro ? (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={40} className="text-muted" />
          </div>
        ) : (
          <img
            src={fotos[selected].url}
            alt={`${titulo} - Foto ${selected + 1}`}
            className="w-full h-full object-contain"
            onError={() => setErro(true)}
          />
        )}

        {fotos.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-colors">
              <ChevronLeft size={20} className="text-navy-deep" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-colors">
              <ChevronRight size={20} className="text-navy-deep" />
            </button>
            <span className="absolute bottom-3 right-3 text-xs font-600 bg-navy-deep text-white px-2.5 py-1 rounded-full">
              {selected + 1}/{fotos.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {fotos.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto">
          {fotos.map((foto, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(idx)}
              className={`w-16 h-12 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                idx === selected ? "border-brand-orange" : "border-transparent hover:border-line"
              }`}
            >
              <img
                src={foto.url}
                alt={`Thumb ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
