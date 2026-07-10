"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Play } from "lucide-react";

export default function ImageGallery({ fotos, videoUrl, titulo }) {
  const items = [];

  if (fotos) {
    fotos.forEach((f) => items.push({ tipo: "foto", url: f.url }));
  }
  if (videoUrl) {
    items.push({ tipo: "video", url: videoUrl });
  }

  const [selected, setSelected] = useState(0);
  const [erro, setErro] = useState(false);

  const prev = useCallback(() => setSelected((s) => (s - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setSelected((s) => (s + 1) % items.length), [items.length]);

  if (items.length === 0) {
    return (
      <div className="aspect-[16/9] bg-sand flex items-center justify-center rounded-2xl border border-line">
        <div className="text-center">
          <ImageOff size={40} className="text-muted mx-auto mb-2" />
          <p className="text-sm text-muted">Nenhuma foto disponível</p>
        </div>
      </div>
    );
  }

  const atual = items[selected];

  return (
    <div className="group relative">
      <div className="relative aspect-[16/9] bg-gray-900 rounded-2xl overflow-hidden">
        {atual.tipo === "video" ? (
          <iframe
            src={atual.url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
            title="Vídeo do veículo"
            className="w-full h-full"
            allowFullScreen
          />
        ) : erro ? (
          <div className="w-full h-full flex items-center justify-center bg-sand">
            <ImageOff size={40} className="text-muted" />
          </div>
        ) : (
          <img
            src={atual.url}
            alt={`${titulo} - Foto ${selected + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={() => setErro(true)}
          />
        )}

        {items.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
            >
              <ChevronLeft size={20} className="text-navy-deep" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
            >
              <ChevronRight size={20} className="text-navy-deep" />
            </button>
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="text-xs font-600 bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                {selected + 1} / {items.length}
              </span>
              {atual.tipo === "video" && (
                <span className="text-xs font-600 bg-brand-orange text-white px-2.5 py-1 rounded-full">
                  <Play size={12} className="inline mr-1" />Vídeo
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-thin">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { setSelected(idx); setErro(false); }}
              className={`relative w-24 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                idx === selected
                  ? "border-brand-orange shadow-md shadow-brand-orange/20"
                  : "border-transparent hover:border-line opacity-60 hover:opacity-100"
              }`}
            >
              {item.tipo === "video" ? (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <Play size={14} className="text-gray-900 ml-0.5" />
                  </div>
                </div>
              ) : (
                <img src={item.url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
