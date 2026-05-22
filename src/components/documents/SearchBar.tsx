"use client";
import { useEffect, useRef, useState } from "react";
import { DOCUMENT_CATEGORIES } from "@/types";

interface Props {
  onSearch: (term: string) => void;
  onCategoryFilter: (category: string) => void;
}

export default function SearchBar({ onSearch, onCategoryFilter }: Props) {
  const [value, setValue] = useState("");
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      if (!value) return;
    }

    const timeoutId = window.setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [value, onSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar por nombre, categoría, etiquetas…"
          className="input-field pl-10"
        />
        {value && (
          <button
            onClick={() => setValue("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
      <select
        onChange={(e) => onCategoryFilter(e.target.value)}
        className="input-field sm:w-48"
        defaultValue=""
      >
        <option value="">Todas las categorías</option>
        {DOCUMENT_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
        ))}
      </select>
    </div>
  );
}
