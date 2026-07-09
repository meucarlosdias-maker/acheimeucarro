"use client";

import { useState } from "react";
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

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-line aspect-[16/10] flex items-center justify-center">
        <div className="text-center">
          <ImageOff size={40} className="text-muted mx-auto mb-2" />
          <p className="text-sm text-muted">Nenhuma foto disponível</p>
        </div>
      </div>
    );
  }

  const atual = items[selected];
  const prev = () => setSelected((s) => (s - 1 + items.length) % items.length);
  const next = () => setSelected((s) => (s + 1) % items.length);

  return (
    <div className="bg-white rounded-xl border border-line overflow-hidden">
      {/* Conteúdo principal */}
      <div className="relative aspect-[16/10] bg-gray-900">
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
            className="w-full h-full object-contain"
            onError={() => setErro(true)}
          />
        )}

        {items.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-colors">
              <ChevronLeft size={20} className="text-navy-deep" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-colors">
              <ChevronRight size={20} className="text-navy-deep" />
            </button>
            <span className="absolute bottom-3 right-3 text-xs font-600 bg-black/60 text-white px-2.5 py-1 rounded-full">
              {selected + 1}/{items.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { setSelected(idx); setErro(false); }}
              className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                idx === selected ? "border-brand-orange" : "border-transparent hover:border-line"
              }`}
            >
              {item.tipo === "video" ? (
                <>
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                      <Play size={14} className="text-gray-900 ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1 left-1 text-[9px] font-600 bg-black/60 text-white px-1 rounded">VÍDEO</span>
                </>
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
